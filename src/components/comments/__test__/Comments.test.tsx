import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent} from '@testing-library/react'
import Comments from '../Comments'
import type { Comment } from '../../../types/comment'

// Mock the hooks and utilities
const mockAddComment = vi.fn()
const mockDeleteComment = vi.fn()

vi.mock('../../../hooks/useComments', () => ({
  useComments: vi.fn(() => ({
  comments: [] as Comment[],
  isLoading: false,
  error: null as string | null,
  addComment: mockAddComment,
  deleteComment: mockDeleteComment,
  totalCommentCount: 0,
})),
}))

describe('Comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the add comment form', () => {
    render(<Comments />)
    
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
    expect(screen.getByText('Add Comment')).toBeInTheDocument()
  })

  it('disables submit button when textarea is empty', () => {
    render(<Comments />)
    
    const submitButton = screen.getByText('Add Comment')
    expect(submitButton).toBeDisabled()
  })

  it('clears textarea after successful submission', () => {
    render(<Comments />)
    
    const textarea = screen.getByPlaceholderText('Write a comment...') as HTMLTextAreaElement
    
    fireEvent.change(textarea, { target: { value: 'Test comment' } })
    fireEvent.click(screen.getByText('Add Comment'))
    
    expect(textarea.value).toBe('')
  })

})
