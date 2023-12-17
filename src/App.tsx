import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyles } from './styles/global'
import { Router } from './routes/Router'
import { CycleContextProvider } from './contexts/CyclesContext'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CycleContextProvider>
          <Router />
        </CycleContextProvider>
      </BrowserRouter>

      <GlobalStyles />
    </ThemeProvider>
  )
}
