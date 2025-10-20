import { component$ } from '@builder.io/qwik'
import { AlertCircleIcon } from 'lucide-qwik'

interface ErrorAlertProps {
  message?: string
  type?: 'error' | 'warning' | 'info'
}

export const ErrorAlert = component$<ErrorAlertProps>(
  ({ message, type = 'error' }) => {
    if (!message) return null

    const styles = {
      error: {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        text: 'text-red-800',
      },
      warning: {
        container: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-800',
      },
      info: {
        container: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-800',
      },
    }

    const style = styles[type]

    return (
      <div class={`rounded-lg border p-4 mb-4 ${style.container}`} role="alert">
        <div class="flex items-start">
          <AlertCircleIcon
            class={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${style.icon}`}
          />
          <div class="flex-1">
            <p class={`text-sm font-medium ${style.text}`}>{message}</p>
          </div>
        </div>
      </div>
    )
  }
)
