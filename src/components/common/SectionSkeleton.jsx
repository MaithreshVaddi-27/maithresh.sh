import { Skeleton } from '@astryxdesign/core/Skeleton'
import { HStack } from '@astryxdesign/core/HStack'
import { VStack } from '@astryxdesign/core/VStack'

/** Structural placeholder rendered per lazy section while its JS chunk loads. */
export default function SectionSkeleton({ cards = 2, height = 148 }) {
  return (
    <section className="mono-section" aria-hidden="true">
      <div className="monograph-container">
        <HStack justify="between" align="center" wrap="wrap" gap={2}>
          <Skeleton width="min(340px, 75vw)" height={34} radius={2} index={0} />
          <Skeleton width="min(180px, 42vw)" height={18} radius={2} index={1} />
        </HStack>
        <div className="section-skeleton-subtitle">
          <Skeleton width="min(520px, 88%)" height={20} radius={2} index={2} />
        </div>
        <VStack gap={3} className="section-skeleton-body">
          {Array.from({ length: cards }, (_, idx) => (
            <Skeleton key={idx} width="100%" height={height} radius={3} index={idx + 3} />
          ))}
        </VStack>
      </div>
    </section>
  )
}
