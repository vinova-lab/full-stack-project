import { useState } from 'react';
import { useNutrition } from '../../context/NutritionContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../ui/Modal.jsx';
import { Field, Select } from '../ui/Field.jsx';
import Button from '../ui/Button.jsx';
import { QUICK_FOODS, MEAL_TYPES } from '../../data/foods.js';
import { displayTime } from '../../utils/dates.js';
import { Empty } from '../ui/States.jsx';

const EMOJI = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' };

function MealCard({ meal, onCheck, onDelete }) {
  return (
    <div className={`meal-card ${meal.done ? 'done' : ''}`}>
      <div className="meal-card__time">
        <span className="meal-card__type-icon" aria-hidden="true">{EMOJI[meal.type] ?? '🍽'}</span>
        <span>{displayTime(meal.time)}</span>
      </div>
      <div className="meal-card__body">
        <div className="meal-card__name">{meal.name}</div>
        <div className="meal-card__macros">
          {meal.kcal}kcal · P:{meal.p}g · C:{meal.c}g · F:{meal.f}g
        </div>
      </div>
      <div className="meal-card__actions">
        <button
          className={`check-btn ${meal.done ? 'on' : ''}`}
          onClick={() => onCheck(meal.id)}
          aria-label={meal.done ? 'Mark not eaten' : 'Mark eaten'}
          aria-pressed={meal.done}
        >
          {meal.done ? '✓' : '○'}
        </button>
        <button className="icon-btn" onClick={() => onDelete(meal.id)} aria-label="Delete meal">🗑</button>
      </div>
    </div>
  );
}

const BLANK = { name: '', type: 'breakfast', time: '08:00', kcal: '', p: '', c: '', f: '' };

export default function MealTimeline({ compact = false }) {
  const { meals, logMeal, checkMeal, deleteMeal } = useNutrition();
  const { success } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [selectedQuick, setSelectedQuick] = useState(null);

  function handleQuickSelect(food) {
    setSelectedQuick(food.id);
    setForm((f) => ({ ...f, name: food.name, kcal: food.kcal, p: food.p, c: food.c, f: food.f }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    logMeal({ ...form, kcal: +form.kcal, p: +form.p, c: +form.c, f: +form.f });
    success('Meal logged!');
    setShowModal(false);
    setForm(BLANK);
    setSelectedQuick(null);
  }

  const sorted = [...meals].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
  const visible = compact ? sorted.slice(0, 4) : sorted;

  return (
    <div className="timeline">
      <div className="row-between" style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 600 }}>Meal Timeline</span>
        <Button size="sm" onClick={() => setShowModal(true)}>+ Add Meal</Button>
      </div>

      {visible.length === 0 ? (
        <Empty emoji="🍽" title="No meals yet" message="Tap Add Meal to log your first meal today." />
      ) : (
        visible.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onCheck={checkMeal}
            onDelete={(id) => { deleteMeal(id); }}
          />
        ))
      )}

      {/* Add Meal Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Log a Meal">
        <form onSubmit={handleSubmit} style={{ padding: '0 1.25rem 1.25rem' }}>
          {/* Quick foods */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>Quick Select</div>
            <div className="macro-pills">
              {QUICK_FOODS.slice(0, 8).map((food) => (
                <button
                  key={food.id}
                  type="button"
                  className={`macro-pill ${selectedQuick === food.id ? 'selected' : ''}`}
                  onClick={() => handleQuickSelect(food)}
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>

          <Field label="Meal Name" id="m-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. Oatmeal with Berries" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Select label="Type" id="m-type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              options={MEAL_TYPES.map((t) => ({ value: t.value, label: t.emoji + ' ' + t.label }))} />
            <Field label="Time" id="m-time" type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <Field label="kcal" id="m-kcal" type="number" min={0} value={form.kcal} onChange={(e) => setForm((f) => ({ ...f, kcal: e.target.value }))} required />
            <Field label="Protein g" id="m-p" type="number" min={0} value={form.p} onChange={(e) => setForm((f) => ({ ...f, p: e.target.value }))} />
            <Field label="Carbs g" id="m-c" type="number" min={0} value={form.c} onChange={(e) => setForm((f) => ({ ...f, c: e.target.value }))} />
            <Field label="Fat g" id="m-f" type="number" min={0} value={form.f} onChange={(e) => setForm((f) => ({ ...f, f: e.target.value }))} />
          </div>
          <Button type="submit" block style={{ marginTop: '1rem' }}>Log Meal</Button>
        </form>
      </Modal>
    </div>
  );
}
