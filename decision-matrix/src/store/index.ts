import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Project, Criterion, Alternative } from '@/types'
import { generateId } from '@/lib/utils'
import { calculateNormalizedScores, calculateTotalScore } from '@/lib/calculations'
import { exportProject as exportProjectToJson, importProject as importProjectFromJson } from '@/lib/storage'

interface AppState {
  // Data
  projects: Project[]
  currentProjectId: string | null

  // Project actions
  createProject: (name: string, description?: string) => void
  deleteProject: (id: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  setCurrentProject: (id: string | null) => void

  // Criterion actions
  addCriterion: (projectId: string, criterion: Omit<Criterion, 'id'>) => void
  updateCriterion: (projectId: string, id: string, updates: Partial<Criterion>) => void
  deleteCriterion: (projectId: string, id: string) => void

  // Alternative actions
  addAlternative: (projectId: string, alt: Omit<Alternative, 'id'>) => void
  updateAlternative: (projectId: string, id: string, updates: Partial<Alternative>) => void
  deleteAlternative: (projectId: string, id: string) => void

  // Calculations
  recalculateScores: (projectId: string) => void

  // Import/Export
  exportProject: (projectId: string) => string | null
  importProject: (jsonString: string) => void
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        projects: [],
        currentProjectId: null,

        createProject: (name, description) => {
          const newProject: Project = {
            id: generateId(),
            name,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            criteria: [],
            alternatives: []
          }

          set(state => ({
            projects: [...state.projects, newProject],
            currentProjectId: newProject.id
          }))
        },

        deleteProject: (id) => {
          set(state => ({
            projects: state.projects.filter(p => p.id !== id),
            currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
          }))
        },

        updateProject: (id, updates) => {
          set(state => ({
            projects: state.projects.map(p =>
              p.id === id
                ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                : p
            )
          }))
        },

        setCurrentProject: (id) => {
          set({ currentProjectId: id })
        },

        addCriterion: (projectId, criterion) => {
          const newCriterion: Criterion = {
            ...criterion,
            id: generateId()
          }

          set(state => ({
            projects: state.projects.map(p =>
              p.id === projectId
                ? {
                    ...p,
                    criteria: [...p.criteria, newCriterion],
                    updatedAt: new Date().toISOString()
                  }
                : p
            )
          }))

          get().recalculateScores(projectId)
        },

        updateCriterion: (projectId, id, updates) => {
          set(state => ({
            projects: state.projects.map(p =>
              p.id === projectId
                ? {
                    ...p,
                    criteria: p.criteria.map(c =>
                      c.id === id ? { ...c, ...updates } : c
                    ),
                    updatedAt: new Date().toISOString()
                  }
                : p
            )
          }))

          get().recalculateScores(projectId)
        },

        deleteCriterion: (projectId, id) => {
          set(state => ({
            projects: state.projects.map(p =>
              p.id === projectId
                ? {
                    ...p,
                    criteria: p.criteria.filter(c => c.id !== id),
                    alternatives: p.alternatives.map(alt => {
                      const newValues = { ...alt.values }
                      delete newValues[id]
                      return { ...alt, values: newValues }
                    }),
                    updatedAt: new Date().toISOString()
                  }
                : p
            )
          }))

          get().recalculateScores(projectId)
        },

        addAlternative: (projectId, alt) => {
          const project = get().projects.find(p => p.id === projectId)
          if (!project) return

          const newAlternative: Alternative = {
            ...alt,
            id: generateId(),
            normalizedScores: calculateNormalizedScores(alt as Alternative, project.criteria),
            totalScore: 0
          }
          newAlternative.totalScore = calculateTotalScore(newAlternative, project.criteria)

          set(state => ({
            projects: state.projects.map(p =>
              p.id === projectId
                ? {
                    ...p,
                    alternatives: [...p.alternatives, newAlternative],
                    updatedAt: new Date().toISOString()
                  }
                : p
            )
          }))
        },

        updateAlternative: (projectId, id, updates) => {
          const project = get().projects.find(p => p.id === projectId)
          if (!project) return

          set(state => ({
            projects: state.projects.map(p =>
              p.id === projectId
                ? {
                    ...p,
                    alternatives: p.alternatives.map(alt => {
                      if (alt.id !== id) return alt
                      const updated = { ...alt, ...updates }
                      updated.normalizedScores = calculateNormalizedScores(updated, p.criteria)
                      updated.totalScore = calculateTotalScore(updated, p.criteria)
                      return updated
                    }),
                    updatedAt: new Date().toISOString()
                  }
                : p
            )
          }))
        },

        deleteAlternative: (projectId, id) => {
          set(state => ({
            projects: state.projects.map(p =>
              p.id === projectId
                ? {
                    ...p,
                    alternatives: p.alternatives.filter(a => a.id !== id),
                    updatedAt: new Date().toISOString()
                  }
                : p
            )
          }))
        },

        recalculateScores: (projectId) => {
          set(state => ({
            projects: state.projects.map(p => {
              if (p.id !== projectId) return p

              const updatedAlternatives = p.alternatives.map(alt => {
                const normalizedScores = calculateNormalizedScores(alt, p.criteria)
                const totalScore = calculateTotalScore({ ...alt, normalizedScores }, p.criteria)
                return { ...alt, normalizedScores, totalScore }
              })

              return {
                ...p,
                alternatives: updatedAlternatives,
                updatedAt: new Date().toISOString()
              }
            })
          }))
        },

        exportProject: (projectId) => {
          const project = get().projects.find(p => p.id === projectId)
          if (!project) return null
          return exportProjectToJson(project)
        },

        importProject: (jsonString) => {
          const project = importProjectFromJson(jsonString)
          // Generate new ID to avoid conflicts
          project.id = generateId()
          project.updatedAt = new Date().toISOString()

          set(state => ({
            projects: [...state.projects, project],
            currentProjectId: project.id
          }))
        }
      }),
      {
        name: 'decision-matrix-storage',
        partialize: (state) => ({
          projects: state.projects,
          currentProjectId: state.currentProjectId
        })
      }
    )
  )
)
