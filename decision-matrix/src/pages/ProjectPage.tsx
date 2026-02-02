import { useState } from 'react'
import { ProjectHeader } from '@/components/project/ProjectHeader'
import { CriteriaList } from '@/components/criteria/CriteriaList'
import { AlternativesTable } from '@/components/alternatives/AlternativesTable'
import { RankingTable } from '@/components/results/RankingTable'
import { ScoreBreakdown } from '@/components/results/ScoreBreakdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store'
import { rankAlternatives } from '@/lib/calculations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ProjectPage() {
  const [selectedAltId, setSelectedAltId] = useState<string | null>(null)

  const currentProjectId = useStore(state => state.currentProjectId)
  const project = useStore(state =>
    state.projects.find(p => p.id === state.currentProjectId)
  )

  if (!project || !currentProjectId) {
    return null
  }

  const ranked = rankAlternatives(project.alternatives, project.criteria)
  const selectedAlt = ranked.find(a => a.id === selectedAltId) || ranked[0]

  return (
    <div className="max-w-5xl mx-auto">
      <ProjectHeader project={project} />

      <Tabs defaultValue="criteria" className="space-y-4">
        <TabsList>
          <TabsTrigger value="criteria">Критерии</TabsTrigger>
          <TabsTrigger value="alternatives">Альтернативы</TabsTrigger>
          <TabsTrigger value="results">Результаты</TabsTrigger>
        </TabsList>

        <TabsContent value="criteria" className="bg-white p-6 rounded-lg shadow-sm">
          <CriteriaList projectId={currentProjectId} criteria={project.criteria} />
        </TabsContent>

        <TabsContent value="alternatives" className="bg-white p-6 rounded-lg shadow-sm">
          <AlternativesTable
            projectId={currentProjectId}
            alternatives={project.alternatives}
            criteria={project.criteria}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <RankingTable
              alternatives={project.alternatives}
              criteria={project.criteria}
            />
          </div>

          {ranked.length > 0 && project.criteria.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Детальный разбор</h3>
                <Select
                  value={selectedAlt?.id || ''}
                  onValueChange={setSelectedAltId}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Выберите альтернативу" />
                  </SelectTrigger>
                  <SelectContent>
                    {ranked.map((alt, idx) => (
                      <SelectItem key={alt.id} value={alt.id}>
                        {idx + 1}. {alt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAlt && (
                <ScoreBreakdown
                  alternative={selectedAlt}
                  criteria={project.criteria}
                />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
