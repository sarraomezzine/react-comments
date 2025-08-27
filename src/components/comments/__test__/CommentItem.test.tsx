import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CommentItem from '../CommentItem'
import type { Comment } from '../../../types/comment'

const mockOnReply = vi.fn()
const mockOnDelete = vi.fn()

const mockComment: Comment = {
  id: '1',
  text: 'This is a test comment',
  timestamp: new Date('2024-01-01T10:00:00Z').getTime(),
  parentId: undefined,
  replies: [],
}

describe('CommentItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders comment content', () => {
    render(
      <CommentItem 
        comment={mockComment} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
  })


  

  it('shows delete button', () => {
    render(
      <CommentItem 
        comment={mockComment} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

 
 it('toggles reply form when reply button is clicked', () => {
    render(
      <CommentItem 
        comment={mockComment} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    )
    
    const replyButton = screen.getByText('Reply')
    
    // Reply form should not be visible initially
    expect(screen.queryByPlaceholderText('Write a reply...')).not.toBeInTheDocument()
    
    // Click reply button
    fireEvent.click(replyButton)
    
    // Reply form should now be visible
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument()
    expect(screen.getByText('Add Reply')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })




})
