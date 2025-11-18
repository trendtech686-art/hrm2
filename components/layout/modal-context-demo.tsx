import * as React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useModalContext } from '../../contexts/modal-context';

/**
 * This component demonstrates the improved modal context system
 * that properly handles overlays across different UI components.
 */
export function ModalContextDemo() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dropdown1Open, setDropdown1Open] = React.useState(false);
  const [dropdown2Open, setDropdown2Open] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  
  const { openModals, activeModal } = useModalContext();
  
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="text-lg font-semibold mb-4">Modal Context Demo</h2>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4">
          {/* Dialog demo */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <DialogContent id="test-dialog">
              <DialogHeader>
                <DialogTitle>Dialog Demo</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                This dialog uses the modal context system.
                <div className="mt-4">
                  <h4 className="font-medium">Try opening other components:</h4>
                  <div className="flex gap-2 mt-2">
                    <DropdownMenu open={dropdown2Open} onOpenChange={setDropdown2Open}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Dropdown in Dialog</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent id="dropdown-in-dialog">
                        <DropdownMenuItem>Item 1</DropdownMenuItem>
                        <DropdownMenuItem>Item 2</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Popover in Dialog</Button>
                      </PopoverTrigger>
                      <PopoverContent id="popover-in-dialog">
                        Popover content inside a dialog
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Standalone dropdown */}
          <DropdownMenu open={dropdown1Open} onOpenChange={setDropdown1Open}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent id="test-dropdown">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Standalone popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent id="test-popover">
              <p>This is a popover using the modal context system</p>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Debug information */}
        <div className="mt-4 p-4 border rounded bg-muted/50 text-sm">
          <h3 className="font-medium mb-2">Debug Information:</h3>
          <div>
            <p><strong>Open Modals:</strong> {openModals.join(', ') || 'None'}</p>
            <p><strong>Active Modal:</strong> {activeModal || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
