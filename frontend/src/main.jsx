import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
      super(props)
          this.state = { error: null }
            }

              static getDerivedStateFromError(error) {
                  return { error }
                    }

                      render() {
                          if (this.state.error) {
                                return (
                                        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
                                                  <h1>SEKAYI ERROR</h1>
                                                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                                                        {this.state.error.toString()}
                                                                                  </pre>
                                                                                          </div>
                                                                                                )
                                                                                                    }

                                                                                                        return this.props.children
                                                                                                          }
                                                                                                          }

                                                                                                          ReactDOM.createRoot(document.getElementById('root')).render(
                                                                                                            <React.StrictMode>
                                                                                                                <ErrorBoundary>
                                                                                                                      <App />
                                                                                                                          </ErrorBoundary>
                                                                                                                            </React.StrictMode>
                                                                                                                            )
