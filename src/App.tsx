import { GameProvider, useGame } from './context/GameContext'
import { StartPage } from './pages/StartPage'
import { StorePage } from './pages/StorePage'
import { WishlistPage } from './pages/WishlistPage'
import { GameDetail } from './pages/GameDetail'
import { EndPage } from './pages/EndPage'
import { RoundResultModal } from './components/results/RoundResultModal'
import { NotebookPanel } from './components/notebook/NotebookPanel'

function Game() {
  const { phase, storePage } = useGame()

  return (
    <>
      {phase === 'start' && <StartPage />}
      {(phase === 'idle' || phase === 'notified' || phase === 'news') && (
        <>
          {storePage === 'store' ? <StorePage /> : <WishlistPage />}
          <NotebookPanel />
        </>
      )}
      {phase === 'detail' && (
        <>
          <GameDetail />
          <NotebookPanel />
        </>
      )}
      {phase === 'result' && (
        <>
          {storePage === 'store' ? <StorePage /> : <WishlistPage />}
          <RoundResultModal />
          <NotebookPanel />
        </>
      )}
      {phase === 'end' && <EndPage />}
    </>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  )
}
