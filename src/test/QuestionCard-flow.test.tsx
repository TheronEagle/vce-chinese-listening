import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from '../components/questions/QuestionCard';
import type { Question } from '../types';

const baseQuestion: Question = {
  id: 'q-flow-1',
  type: 'multiple_choice',
  chineseQuestion: '测试问题',
  englishInstruction: 'Test?',
  marks: 1,
  options: ['一', '二', '三', '四'],
  correctOptionIndex: 1,
};

/**
 * Regression test for the Q1→Q2 progression bug actually
 * manifesting in the rendered DOM:
 *
 * After clicking an MC option, the submit button MUST become
 * enabled. Previously the useEffect resetting state on answer=undefined
 * ran on every render and clobbered the local selectedOption.
 */
describe('QuestionCard — click flow regression', () => {
  it('clicking an MC option enables the submit button', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={1}
        onSubmit={vi.fn()}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /submit answer/i });
    expect(submitBtn).toBeDisabled();

    const optionB = screen.getByRole('radio', { name: /B\./ });
    fireEvent.click(optionB);

    // After clicking B, submit must be enabled.
    expect(submitBtn).not.toBeDisabled();
  });

  it('after submit, only Try Again + Next appear', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={1}
        onSubmit={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /B\./ }));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    // Submit button must be GONE (replaced by Next).
    expect(screen.queryByRole('button', { name: /submit answer/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    // Confirmation banner present.
    expect(screen.getByText(/answer submitted/i)).toBeInTheDocument();
  });

  it('clicking next, then a new question shows clean inputs', () => {
    const onNext = vi.fn();
    const { rerender } = render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={2}
        onSubmit={vi.fn()}
        onNext={onNext}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /B\./ }));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));

    expect(onNext).toHaveBeenCalled();

    // Re-render with Q2 (key would normally change in parent).
    const q2 = { ...baseQuestion, id: 'q-flow-2', chineseQuestion: '第二个问题' };
    rerender(
      <QuestionCard
        key="q-flow-2"
        question={q2}
        index={1}
        total={2}
        onSubmit={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    expect(screen.getByText(/第二个问题/)).toBeInTheDocument();
    // Submit disabled again (no selection yet).
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeDisabled();
    // No options checked.
    screen.getAllByRole('radio').forEach(r => {
      expect(r.getAttribute('aria-checked')).toBe('false');
    });
  });

  it('handles multiple clicks on different options (only last selected)', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={1}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /A\./ }));
    expect(screen.getByRole('radio', { name: /A\./ }).getAttribute('aria-checked')).toBe('true');

    fireEvent.click(screen.getByRole('radio', { name: /C\./ }));
    expect(screen.getByRole('radio', { name: /A\./ }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('radio', { name: /C\./ }).getAttribute('aria-checked')).toBe('true');
  });

  it('MC submit fires onSubmit with the selected option index', () => {
    const onSubmit = vi.fn();
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={1}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: /D\./ }));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));
    expect(onSubmit).toHaveBeenCalledWith('q-flow-1', 3); // index 3 = "四"
  });
});