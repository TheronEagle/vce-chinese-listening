/**
 * E2E test: practice page → submit Q1 → Q2 fresh state.
 *
 * Uses MemoryRouter + Zustand stores to simulate the actual app flow
 * without needing the browser.
 *
 * NOTE: ex-001 has MC for Q1, which_three (written) for Q2. So we test
 * Q1 with MC and Q2 with textarea.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PracticePage } from '../pages/PracticePage';

describe('PracticePage — full Q1→Q2→Q3→Finish flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Q1 MC: pick option, submit, see Try Again + Next', () => {
    render(
      <MemoryRouter initialEntries={['/practice?exercise=ex-001']}>
        <PracticePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/第 1 题/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: /B\./ }));

    const submitBtn = screen.getByRole('button', { name: /submit answer/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    expect(screen.getByText(/answer submitted/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit answer/i })).not.toBeInTheDocument();
  });

  it('Q2 (written) after Next has empty textarea', () => {
    render(
      <MemoryRouter initialEntries={['/practice?exercise=ex-001']}>
        <PracticePage />
      </MemoryRouter>,
    );

    // Q1: pick + submit
    fireEvent.click(screen.getByRole('radio', { name: /B\./ }));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    // Forward to Q2 (which_three — written)
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getByText(/第 2 题/)).toBeInTheDocument();

    // Textarea is fresh
    const textarea = screen.getByLabelText(/your answer in chinese/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');

    // Submit disabled (empty input)
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeDisabled();

    // No "Answer submitted" banner
    expect(screen.queryByText(/answer submitted/i)).not.toBeInTheDocument();
  });

  it('navigating back to Q1 preserves the submitted state', () => {
    render(
      <MemoryRouter initialEntries={['/practice?exercise=ex-001']}>
        <PracticePage />
      </MemoryRouter>,
    );

    // Q1: pick + submit
    fireEvent.click(screen.getByRole('radio', { name: /B\./ }));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    // Forward to Q2
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));

    // Back to Q1 via dot
    fireEvent.click(screen.getByRole('button', { name: /go to question 1/i }));

    // Q1 still shows the submitted banner AND shows the selected answer text
    expect(screen.getByText(/answer submitted/i)).toBeInTheDocument();
    expect(screen.getByText(/你的答案/)).toBeInTheDocument();
    // Try Again + Next Question still available
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('Try Again on Q1 resets only Q1 — Q2 answer survives', () => {
    render(
      <MemoryRouter initialEntries={['/practice?exercise=ex-001']}>
        <PracticePage />
      </MemoryRouter>,
    );

    // Q1: pick + submit
    fireEvent.click(screen.getByRole('radio', { name: /B\./ }));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    // Q2: type + submit
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    const textarea = screen.getByLabelText(/your answer in chinese/i);
    fireEvent.change(textarea, { target: { value: '因为成绩好。可以教中文。学生会喜欢他。' } });
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    // Now go back to Q1 and Try Again
    fireEvent.click(screen.getByRole('button', { name: /go to question 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    // Q1 now unsubmitted
    expect(screen.queryByText(/answer submitted/i)).not.toBeInTheDocument();
    screen.getAllByRole('radio').forEach(r => {
      expect(r.getAttribute('aria-checked')).toBe('false');
    });

    // But Q2 should still be answered
    fireEvent.click(screen.getByRole('button', { name: /go to question 2/i }));
    expect(screen.getByText(/answer submitted/i)).toBeInTheDocument();
  });

  it('Finish button appears on the last question', () => {
    render(
      <MemoryRouter initialEntries={['/practice?exercise=ex-001']}>
        <PracticePage />
      </MemoryRouter>,
    );

    // Q1 of 5 — no finish button yet
    expect(screen.queryByRole('button', { name: /finish exercise/i })).not.toBeInTheDocument();

    // Jump to Q5 directly
    fireEvent.click(screen.getByRole('button', { name: /go to question 5/i }));
    expect(screen.getByText(/第 5 题/)).toBeInTheDocument();
  });
});