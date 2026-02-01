import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ProjectPage } from '@/pages/ProjectPage'
import { useStore } from '@/store'

function App() {
  const currentProjectId = useStore(state => state.currentProjectId)

  return (
    <Layout>
      {currentProjectId ? <ProjectPage /> : <HomePage />}
    </Layout>
  )
}

export default App
