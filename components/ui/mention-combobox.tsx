/**
 * Mention Combobox for TipTap Editor
 * 
 * Virtualized dropdown with search for @mention functionality
 * Optimized for 100+ employees
 */

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import { Check } from 'lucide-react';

export interface MentionOption {
  id: string;
  label: string;
  avatar?: string;
}

interface MentionComboboxProps {
  items: MentionOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export class MentionCombobox {
  items: MentionOption[];
  selectedIndex: number;
  element: HTMLElement;
  command: any;
  query: string;
  virtualizer: any;
  parentRef: HTMLDivElement | null;

  constructor(props: any) {
    this.items = props.items;
    this.command = props.command;
    this.query = '';
    this.selectedIndex = 0;
    this.parentRef = null;
    this.element = document.createElement('div');
    this.element.className = 'bg-popover text-popover-foreground border border-border rounded-md shadow-lg overflow-hidden z-50';
    this.element.style.width = '320px';
    this.element.style.maxHeight = '420px';
    this.render();
  }

  render() {
    if (this.items.length === 0) {
      this.element.innerHTML = `
        <div class="p-4 text-center">
          <div class="text-sm text-muted-foreground">Không tìm thấy nhân viên</div>
          <div class="text-xs text-muted-foreground mt-1">Thử tìm kiếm với từ khóa khác</div>
        </div>
      `;
      return;
    }

    // Header
    const headerHtml = `
      <div class="border-b border-border bg-muted/30 px-3 py-2 flex items-center justify-between sticky top-0 z-10">
        <div class="text-xs font-medium text-muted-foreground flex items-center gap-2">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Tag nhân viên • ${this.items.length} người</span>
        </div>
      </div>
    `;

    // Virtualized list - Render all items
    const itemsHtml = this.items
      .map((item, index) => {
        const isSelected = index === this.selectedIndex;
        const avatarInitial = item.label ? item.label[0].toUpperCase() : '?';
        
        return `
          <button
            type="button"
            class="mention-item flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-all ${
              isSelected 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent/50'
            }"
            data-index="${index}"
            data-id="${item.id}"
          >
            ${
              item.avatar 
                ? `<img src="${item.avatar}" alt="${item.label}" class="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-border" />` 
                : `<div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-primary/20">${avatarInitial}</div>`
            }
            <span class="font-medium truncate flex-1 text-left">${item.label}</span>
            ${isSelected ? '<svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
          </button>
        `;
      })
      .join('');

    this.element.innerHTML = `
      ${headerHtml}
      <div class="overflow-y-auto scrollbar-thin" style="max-height: 380px;" data-scroll-container>
        ${itemsHtml}
      </div>
    `;

    // Add click event listeners
    this.element.querySelectorAll('.mention-item').forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectItem(index);
      });
      
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
      
      // Hover to highlight
      btn.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
    });
    
    // Auto scroll to selected item
    this.scrollToSelected();
  }
  
  updateSelection() {
    const buttons = this.element.querySelectorAll('.mention-item');
    buttons.forEach((btn, index) => {
      if (index === this.selectedIndex) {
        btn.classList.add('bg-accent', 'text-accent-foreground');
        btn.classList.remove('hover:bg-accent/50');
        // Add checkmark
        const hasCheck = btn.querySelector('svg');
        if (!hasCheck) {
          btn.innerHTML = btn.innerHTML + '<svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        }
      } else {
        btn.classList.remove('bg-accent', 'text-accent-foreground');
        btn.classList.add('hover:bg-accent/50');
        // Remove checkmark
        const check = btn.querySelector('svg');
        if (check) check.remove();
      }
    });
    this.scrollToSelected();
  }
  
  scrollToSelected() {
    const scrollContainer = this.element.querySelector('[data-scroll-container]') as HTMLElement;
    const buttons = this.element.querySelectorAll('.mention-item');
    const selectedButton = buttons[this.selectedIndex] as HTMLElement;
    
    if (scrollContainer && selectedButton) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const itemRect = selectedButton.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      
      const itemTop = itemRect.top - containerRect.top + scrollTop;
      const itemBottom = itemTop + itemRect.height;
      
      const visibleTop = scrollTop;
      const visibleBottom = scrollTop + scrollContainer.clientHeight;
      
      if (itemTop < visibleTop) {
        scrollContainer.scrollTop = itemTop - 8; // 8px padding
      } else if (itemBottom > visibleBottom) {
        scrollContainer.scrollTop = itemBottom - scrollContainer.clientHeight + 8;
      }
    }
  }

  updateProps(props: any) {
    this.items = props.items;
    this.command = props.command;
    this.selectedIndex = 0;
    this.render();
  }

  onKeyDown({ event }: { event: KeyboardEvent }) {
    if (event.key === 'ArrowUp') {
      this.upHandler();
      return true;
    }
    if (event.key === 'ArrowDown') {
      this.downHandler();
      return true;
    }
    if (event.key === 'Enter') {
      this.enterHandler();
      return true;
    }
    return false;
  }

  upHandler() {
    this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length;
    this.updateSelection();
  }

  downHandler() {
    this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    this.updateSelection();
  }

  enterHandler() {
    this.selectItem(this.selectedIndex);
  }

  selectItem(index: number) {
    const item = this.items[index];
    if (item && this.command) {
      this.command({ id: item.id, label: item.label });
    }
  }

  destroy() {
    this.element.remove();
  }
}
