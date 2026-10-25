import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { cn } from '@/lib/utils'

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof FontAwesomeIcon>, 'icon'>) {
  return (
    <FontAwesomeIcon
      icon={faSpinner}
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
