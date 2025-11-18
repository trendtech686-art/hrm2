import * as React from "react"
import { GripVertical } from "lucide-react"

import { cn } from "../../lib/utils.ts"

// --- Context ---
type ResizablePanelGroupContextType = {
  direction: "horizontal" | "vertical"
  startDragging: (event: React.MouseEvent, handleIndex: number) => void
  panelSizes: number[]
  isDragging: boolean
}

const ResizablePanelGroupContext = React.createContext<ResizablePanelGroupContextType | null>(null)

const useResizablePanelGroup = () => {
  const context = React.useContext(ResizablePanelGroupContext)
  if (!context) {
    throw new Error("Resizable components must be used within a ResizablePanelGroup")
  }
  return context
}

// --- ResizablePanelGroup ---
type ResizablePanelGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  direction: "horizontal" | "vertical"
}

const ResizablePanelGroup = ({ className, children, direction, ...props }: ResizablePanelGroupProps) => {
  const groupRef = React.useRef<HTMLDivElement>(null)
  const [panelSizes, setPanelSizes] = React.useState<number[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const panelChildren = React.useMemo(() => React.Children.toArray(children).filter(child => React.isValidElement(child) && (child.type as any).displayName === "ResizablePanel"), [children]);

  // Initialize panel sizes from children's defaultSize props
  React.useEffect(() => {
    const initialSizes = panelChildren.map(child => {
      // FIX: Cast `child.props` to `any` to allow accessing `defaultSize`.
      return (child as React.ReactElement<any>).props.defaultSize || 100 / panelChildren.length
    })

    // Normalize sizes to sum to 100
    const total = initialSizes.reduce((a, b) => a + b, 0)
    if (total > 0) {
        const normalizedSizes = initialSizes.map(size => (size / total) * 100)
        setPanelSizes(normalizedSizes)
    }
  }, [children]);

  const startDragging = (event: React.MouseEvent, handleIndex: number) => {
    event.preventDefault()
    setIsDragging(true)
    const container = groupRef.current
    if (!container) return

    const initialPos = direction === 'horizontal' ? event.clientX : event.clientY
    const { width, height } = container.getBoundingClientRect()
    const containerSize = direction === 'horizontal' ? width : height
    const initialSizes = [...panelSizes];

    const prevPanel = panelChildren[handleIndex] as React.ReactElement<any>;
    const minSizePrev = prevPanel.props.minSize || 0
    const nextPanel = panelChildren[handleIndex + 1] as React.ReactElement<any>;
    const minSizeNext = nextPanel.props.minSize || 0

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const delta = currentPos - initialPos
      const deltaPercent = (delta / containerSize) * 100
      
      const newSizes = [...initialSizes]
      
      let newPrevSize = initialSizes[handleIndex] + deltaPercent
      let newNextSize = initialSizes[handleIndex + 1] - deltaPercent

      // Clamp sizes based on minSize
      if (newPrevSize < minSizePrev) {
        const diff = minSizePrev - newPrevSize;
        newPrevSize = minSizePrev
        newNextSize -= diff;
      }
      if (newNextSize < minSizeNext) {
        const diff = minSizeNext - newNextSize;
        newNextSize = minSizeNext
        newPrevSize -= diff;
      }

      // Final check to prevent negative sizes after clamping
      if (newPrevSize < minSizePrev) newPrevSize = minSizePrev;
      if (newNextSize < minSizeNext) newNextSize = minSizeNext;
      
      newSizes[handleIndex] = newPrevSize
      newSizes[handleIndex + 1] = newNextSize

      setPanelSizes(newSizes)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const contextValue = { direction, startDragging, panelSizes, isDragging }
  
  let panelIndexCounter = 0
  let handleIndexCounter = 0

  return (
    <ResizablePanelGroupContext.Provider value={contextValue}>
      <div
        ref={groupRef}
        className={cn(
          "flex w-full h-full data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={direction === 'vertical' ? 'vertical' : 'horizontal'}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null
          
          if ((child.type as any).displayName === "ResizablePanel") {
            const index = panelIndexCounter++
            return React.cloneElement(child, { index } as any)
          }

          if ((child.type as any).displayName === "ResizableHandle") {
            const index = handleIndexCounter++
             return React.cloneElement(child, { index } as any)
          }

          return child
        })}
      </div>
    </ResizablePanelGroupContext.Provider>
  )
}
ResizablePanelGroup.displayName = "ResizablePanelGroup"

// --- ResizablePanel ---
type ResizablePanelProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultSize?: number
  minSize?: number
  index?: number // Injected by group
}

const ResizablePanel = ({ className, children, index = 0, ...props }: ResizablePanelProps) => {
  const { panelSizes, isDragging } = useResizablePanelGroup()
  const size = panelSizes[index]

  return (
    <div
      className={cn(
        "overflow-hidden",
        !isDragging && "transition-all",
        className
      )}
      style={{ flexBasis: `${size}%`, flexGrow: 0, flexShrink: 0 }}
      {...props}
    >
      {children}
    </div>
  )
}
ResizablePanel.displayName = "ResizablePanel"

// --- ResizableHandle ---
type ResizableHandleProps = React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean
  index?: number // Injected by group
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle, index = 0, ...props }, ref) => {
    const { direction, startDragging } = useResizablePanelGroup()
    
    return (
      <div
        ref={ref}
        onMouseDown={(e) => startDragging(e, index)}
        className={cn(
          "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0 [&[data-orientation=horizontal]]:cursor-col-resize [&[data-orientation=vertical]]:cursor-row-resize",
          className
        )}
        data-orientation={direction === 'vertical' ? 'vertical' : 'horizontal'}
        {...props}
      >
        {withHandle && (
          <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
            <GripVertical className="h-2.5 w-2.5" />
          </div>
        )}
      </div>
    )
  }
)
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
