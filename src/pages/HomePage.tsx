import Hero from '../components/Hero'
import StatsStrip from '../components/StatsStrip'
import TrainingHighlights from '../components/TrainingHighlights'
import MissionQuote from '../components/MissionQuote'
import CoursesGrid from '../components/CoursesGrid'

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center px-4 pt-24 pb-12">
        <Hero />
      </div>
      <StatsStrip />
      <TrainingHighlights />
      <MissionQuote />
      <div className="flex flex-col items-center px-4 py-12">
        <CoursesGrid />
      </div>
    </>
  )
}
