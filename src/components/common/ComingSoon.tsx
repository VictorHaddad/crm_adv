import { Hammer } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from './EmptyState'

/** Placeholder para telas ainda não implementadas neste protótipo. */
export function ComingSoon({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={Hammer}
        title="Em construção"
        description="Esta tela será desenvolvida na próxima etapa do protótipo."
      />
    </div>
  )
}
