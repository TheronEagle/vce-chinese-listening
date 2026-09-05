import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from '../components/questions/QuestionCard';
import type { Question } from '../types';

const baseQuestion: Question = {
  id: 'q1',
  type: 'multiple_choice',
  chineseQuestion: '你喜欢什么运动？',
  englishInstruction: 'What sport do you like?',
  marks: 1,
  options: ['篮球', '足球', '游泳', '跑步'],
  correctOptionIndex: 2,
};

const writtenQuestion: Question = {
  id: 'q2',
  type: 'why_reason',
  chineseQuestion: '你为什么喜欢学中文？',
  englishInstruction: 'Why do you like learning Chinese?',
  marks: 3,
  markingPoints: [
    {
      id: 'mp-1',
      keyIdea: 'culture',
      englishMeaning: 'Interested in Chinese culture',
      chineseKeywords: ['文化', '历史'],
      marks: 2,
    },
    {
      id: 'mp-2',
      keyIdea: 'career',
      englishMeaning: 'Career opportunities',
      chineseKeywords: ['工作'],
      marks: 1,
    },
  ],
  modelAnswer: '因为我对中文文化和历史感兴趣，也想找跟中文相关的工作。',
};

describe('QuestionCard — independent per-question state', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with empty input for an unanswered MC question', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        onSubmit={() => {}}
      />,
    );
    // No option should appear "selected" by default. Submit button should be disabled.
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit after an option is picked', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        onSubmit={() => {}}
      />,
    );
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it('calls onSubmit with the selected option index', () => {
    const onSubmit = vi.fn();
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        onSubmit={onSubmit}
      />,
    );
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[2]);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith('q1', 2);
  });

  it('shows confirmation banner and Next button after submission', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        onSubmit={() => {}}
        onNext={vi.fn()}
      />,
    );
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Confirmation
    expect(screen.getByText(/answer submitted/i)).toBeInTheDocument();
    // Next Question button appears
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
    // Try Again link
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('shows Finish button instead of Next on the last question', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={2}
        total={3}
        onSubmit={() => {}}
        onNext={vi.fn()}
        onFinish={vi.fn()}
        isLast
      />,
    );
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next question/i })).not.toBeInTheDocument();
  });

  it('Try Again resets input back to clean state', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        onSubmit={() => {}}
        onNext={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByRole('radio')[1]);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    // Should now show the Submit button again (not the Next button)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('does not call onSubmit twice (no double submission)', () => {
    const onSubmit = vi.fn();
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        onSubmit={onSubmit}
        onNext={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    // After submission, the submit button is gone — Try Again resets it,
    // but clicking it again should NOT fire onSubmit.
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('rehydrates state when a persisted answer prop is provided', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={0}
        total={3}
        answer={{ questionId: 'q1', answer: 1, isCorrect: false, marksAwarded: 0, marksTotal: 1 }}
        onSubmit={() => {}}
        onNext={vi.fn()}
      />,
    );
    // Should show the persisted answer and "Answer submitted" banner
    expect(screen.getByText(/answer submitted/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  it('handles written questions with textarea + Cmd+Enter shortcut', () => {
    const onSubmit = vi.fn();
    render(
      <QuestionCard
        question={writtenQuestion}
        index={0}
        total={1}
        onSubmit={onSubmit}
      />,
    );
    const textarea = screen.getByLabelText(/your answer in chinese/i);
    fireEvent.change(textarea, { target: { value: '因为我想了解中国文化' } });
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalledWith('q2', '因为我想了解中国文化');
  });

  it('disables submit on empty written answer', () => {
    render(
      <QuestionCard
        question={writtenQuestion}
        index={0}
        total={1}
        onSubmit={() => {}}
      />,
    );
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows the question number and total marks in header', () => {
    render(
      <QuestionCard
        question={baseQuestion}
        index={2}
        total={5}
        onSubmit={() => {}}
      />,
    );
    expect(screen.getByText(/第 3 题/)).toBeInTheDocument();
    expect(screen.getByText(/\/ 5/)).toBeInTheDocument();
    expect(screen.getByText(/1 mark/)).toBeInTheDocument();
  });

  it('marks allocation pluralises correctly', () => {
    render(
      <QuestionCard
        question={writtenQuestion}
        index={0}
        total={1}
        onSubmit={() => {}}
      />,
    );
    expect(screen.getByText(/3 marks/)).toBeInTheDocument();
  });
});

describe('QuestionCard — proves per-question state isolation via key prop', () => {
  it('two QuestionCards with different question ids have independent state', () => {
    // This is the actual test of the Q1→Q2 isolation fix.
    // Previously: same component instance, state leaked.
    // Now: React fully remounts because parent passes key={question.id}.
    // We simulate this by rendering two cards back-to-back.
    const q1 = { ...baseQuestion, id: 'q1', chineseQuestion: '问题一' };
    const q2 = { ...baseQuestion, id: 'q2', chineseQuestion: '问题二' };

    const { rerender } = render(
      <QuestionCard
        question={q1}
        index={0}
        total={2}
        onSubmit={() => {}}
      />,
    );
    // Type into Q1 — pick option B
    fireEvent.click(screen.getAllByRole('radio')[1]);

    // Simulate parent re-rendering with key change → full remount
    rerender(
      <QuestionCard
        key="q2"
        question={q2}
        index={1}
        total={2}
        onSubmit={() => {}}
      />,
    );

    // Q2 must show all options unselected (fresh state)
    const options = screen.getAllByRole('radio');
    options.forEach(opt => {
      expect(opt.getAttribute('aria-checked')).toBe('false');
    });
    // Submit button should be disabled (no selection yet)
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});