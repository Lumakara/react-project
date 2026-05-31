import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboard from './AdminDashboard';

const mockData = {
  profile: { name: 'Test Name', bio: 'Test Bio' },
  education: [],
  experience: [
    { id: 'exp1', year: '2023', title: 'Dev', desc: 'Desc', details: ['Detail 1'] }
  ],
  organization: []
};

describe('AdminDashboard', () => {
  it('renders nothing if not open', () => {
    const { container } = render(
      <AdminDashboard isOpen={false} onClose={vi.fn()} onSave={vi.fn()} portfolioData={mockData} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders tabs and content when open', () => {
    render(
      <AdminDashboard isOpen={true} onClose={vi.fn()} onSave={vi.fn()} portfolioData={mockData} />
    );
    expect(screen.getByText('CRUD Admin Panel')).toBeInTheDocument();
    
    // Check Profile inputs
    expect(screen.getByDisplayValue('Test Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Bio')).toBeInTheDocument();
  });

  it('allows saving and formats experience details', () => {
    const handleSave = vi.fn();
    render(
      <AdminDashboard isOpen={true} onClose={vi.fn()} onSave={handleSave} portfolioData={mockData} />
    );

    // Switch to Experience tab
    fireEvent.click(screen.getByText('Experience'));
    
    // Edit details
    const detailsTextarea = screen.getByDisplayValue('Detail 1');
    fireEvent.change(detailsTextarea, { target: { value: 'Detail 1\n\nDetail 2\n ' } });

    // Save
    fireEvent.click(screen.getByText('Save & Apply'));

    // Check if onSave was called with properly filtered details
    expect(handleSave).toHaveBeenCalled();
    const savedData = handleSave.mock.calls[0][0];
    expect(savedData.experience[0].details).toEqual(['Detail 1', 'Detail 2']);
  });
});
