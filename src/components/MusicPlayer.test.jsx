import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MusicPlayer, { playlist } from './MusicPlayer';

describe('MusicPlayer', () => {
  it('renders mini player with current track info', () => {
    const setTrackIdx = vi.fn();
    render(<MusicPlayer currentTrackIdx={0} setTrackIdx={setTrackIdx} />);
    
    expect(screen.getByText(playlist[0].title)).toBeInTheDocument();
    expect(screen.getByText(playlist[0].artist)).toBeInTheDocument();
  });

  it('can open modal and show details', () => {
    const setTrackIdx = vi.fn();
    render(<MusicPlayer currentTrackIdx={0} setTrackIdx={setTrackIdx} />);
    
    const miniPlayerContainer = document.getElementById('miniPlayer').firstChild;
    fireEvent.click(miniPlayerContainer);
    
    expect(screen.getAllByText(playlist[0].title).length).toBe(2);
  });
});
