import * as React from "react"

type ModalType = 'dialog' | 'dropdown' | 'popover' | 'sheet' | 'drawer' | 'select' | 'custom';

interface ModalMetadata {
  type: ModalType;
  zIndex?: number | undefined;
  className?: string | undefined;
}

interface ModalContextType {
  // Stack of modals in order they were opened (oldest first)
  openModals: string[];
  // The most recently opened modal (top of stack)
  activeModal: string | null;
  // Register a modal with the context
  registerModal: (id: string, type: ModalType, metadata?: Omit<ModalMetadata, 'type'>) => void;
  // Unregister a modal from the context
  unregisterModal: (id: string) => void;
  // Whether to show the global overlay
  shouldShowOverlay: boolean;
  // Get metadata about all registered modals
  modalMetadata: Record<string, ModalMetadata>;
  // Get z-index for a particular modal
  getZIndex: (id: string) => number;
  // Check if a modal is active (top-most)
  isModalActive: (id: string) => boolean;
}

const DEFAULT_Z_INDEX = {
  dialog: 50,
  drawer: 50,
  sheet: 50,
  dropdown: 40,
  popover: 40,
  select: 40,
  custom: 30,
};

const BASE_Z_INDEX = 40;

const ModalContext = React.createContext<ModalContextType>({
  openModals: [],
  activeModal: null,
  registerModal: () => {},
  unregisterModal: () => {},
  shouldShowOverlay: false,
  modalMetadata: {},
  getZIndex: () => BASE_Z_INDEX,
  isModalActive: () => false,
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openModals, setOpenModals] = React.useState<string[]>([]);
  const [modalMetadata, setModalMetadata] = React.useState<Record<string, ModalMetadata>>({});

  // Register a new modal with its type and metadata
  const registerModal = React.useCallback((id: string, type: ModalType, metadata?: Omit<ModalMetadata, 'type'>) => {
    setOpenModals((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    
    setModalMetadata((prev) => ({
      ...prev,
      [id]: {
        type,
        zIndex: metadata?.zIndex || DEFAULT_Z_INDEX[type],
        className: metadata?.className,
      }
    }));
  }, []);

  // Remove a modal from tracking
  const unregisterModal = React.useCallback((id: string) => {
    setOpenModals((prev) => prev.filter((modalId) => modalId !== id));
    setModalMetadata((prev) => {
      const newMetadata = { ...prev };
      delete newMetadata[id];
      return newMetadata;
    });
  }, []);

  // The active modal is the last one in the stack
  const activeModal = openModals.length > 0 ? openModals[openModals.length - 1] : null;
  
  // Show overlay when any modal is open
  const shouldShowOverlay = openModals.length > 0;
  
  // Calculate z-index for a given modal
  const getZIndex = React.useCallback((id: string) => {
    const metadata = modalMetadata[id];
    if (!metadata) return BASE_Z_INDEX;
    
    // Base z-index for this type of modal
    const baseZ = metadata.zIndex || DEFAULT_Z_INDEX[metadata.type];
    
    // Position in the stack (higher = more recently opened)
    const position = openModals.indexOf(id);
    if (position === -1) return baseZ;
    
    // Add position bonus (more recent modals get higher z-index)
    return baseZ + position;
  }, [modalMetadata, openModals]);
  
  // Check if a modal is the active (top) one
  const isModalActive = React.useCallback((id: string) => {
    return id === activeModal;
  }, [activeModal]);

  const value = React.useMemo(() => ({
    openModals,
    activeModal,
    registerModal,
    unregisterModal,
    shouldShowOverlay,
    modalMetadata,
    getZIndex,
    isModalActive,
  }), [
    openModals,
    activeModal,
    registerModal,
    unregisterModal,
    shouldShowOverlay,
    modalMetadata,
    getZIndex,
    isModalActive,
  ]);

  return (
    <ModalContext.Provider value={value}>
      {/* Không dùng overlay toàn cục nữa */}
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Hook to use in components that need modal functionality
 * @param id Unique identifier for this modal
 * @param isOpen Whether the modal is currently open
 * @param type Type of modal (dialog, dropdown, etc.)
 * @param metadata Optional additional metadata
 */
export function useModal(
  id: string, 
  isOpen: boolean, 
  type: ModalType = 'dialog', 
  metadata?: Omit<ModalMetadata, 'type'>
) {
  const { 
    registerModal, 
    unregisterModal, 
    getZIndex, 
    isModalActive 
  } = React.useContext(ModalContext);

  React.useEffect(() => {
    if (isOpen) {
      registerModal(id, type, metadata);
    } else {
      unregisterModal(id);
    }
    return () => {
      unregisterModal(id);
    };
  }, [id, isOpen, type, metadata, registerModal, unregisterModal]);
  
  const zIndex = getZIndex(id);
  const isActive = isModalActive(id);
  
  return {
    zIndex,
    isActive,
  };
}

export function useModalContext() {
  return React.useContext(ModalContext);
}
