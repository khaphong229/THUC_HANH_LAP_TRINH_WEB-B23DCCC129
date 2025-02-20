import { useState } from "react"
import "./subject-infor.less"

interface Subject {
  id: string
  name: string
  time: string | null
  duration: string | null
  content: string | null
  notes?: string | null
}

interface SubjectGoal {
  monthlyTarget: number
  currentProgress: number
  specificGoals: string
}

interface SubjectInforProps {
  sub: Subject[]
  onClose: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function SubjectInfor({ sub, onClose }: SubjectInforProps) {
  const [subjectData, setSubjectData] = useState<Subject>({
    id: sub[0]?.id || "",
    name: sub[0]?.name || "",
    time: sub[0]?.time || "",
    duration: sub[0]?.duration || "",
    content: sub[0]?.content || "",
    notes: sub[0]?.notes || "",
  })

  const [goals, setGoals] = useState<SubjectGoal>({
    monthlyTarget: 20,
    currentProgress: 8,
    specificGoals: "Complete all practice exercises and score above 80% on final exam",
  })

  const handleInputChange = (field: keyof Subject, value: string) => {
    setSubjectData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGoalChange = (field: keyof SubjectGoal, value: string | number) => {
    setGoals((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const progressPercentage = (goals.currentProgress / goals.monthlyTarget) * 100

  return (
    <div className="subject-modal">
      <div className="subject-modal__overlay" onClick={onClose} />
      <div className="subject-modal__content">
        <div className="subject-modal__header">
          <h4>Subject Information</h4>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="subject-modal__body">
          <div className="form-section">
            <div className="form-group">
              <label className="form-group__label">Subject Name</label>
              <input
                className="form-group__input"
                value={subjectData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="form-section__grid form-section__grid--two-cols">
              <div className="form-group">
                <label className="form-group__label">Class Time</label>
                <input
                  className="form-group__input"
                  type="time"
                  value={subjectData.time || ""}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-group__label">Duration (minutes)</label>
                <input
                  className="form-group__input"
                  type="number"
                  value={subjectData.duration || ""}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-group__label">Content</label>
              <textarea
                className="form-group__textarea"
                value={subjectData.content || ""}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-group__label">Notes</label>
              <textarea
                className="form-group__textarea"
                value={subjectData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="goals-section">
            <h3 className="form-section__title">Learning Goals</h3>

            <div className="form-group">
              <label className="form-group__label">Monthly Study Target (hours)</label>
              <input
                className="form-group__input"
                type="number"
                value={goals.monthlyTarget}
                onChange={(e) => handleGoalChange("monthlyTarget", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="goals-section__progress">
              <label className="form-group__label">Progress</label>
              <div className="goals-section__progress-bar">
                <div className="goals-section__progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
              <p className="goals-section__progress-text">
                {goals.currentProgress} of {goals.monthlyTarget} hours completed ({Math.round(progressPercentage)}%)
              </p>
            </div>

            <div className="form-group">
              <label className="form-group__label">Specific Goals</label>
              <textarea
                className="form-group__textarea"
                value={goals.specificGoals}
                onChange={(e) => handleGoalChange("specificGoals", e.target.value)}
                rows={3}
              />
            </div>

            <div className="goals-section__status">
              <h4 className="goals-section__status-title">Goal Status</h4>
              <p
                className={`goals-section__status-text ${
                  progressPercentage >= 100 ? "goals-section__status-text--success" : ""
                }`}
              >
                {progressPercentage >= 100
                  ? "🎉 Congratulations! You've reached your monthly target!"
                  : `📚 Keep going! You're ${Math.round(100 - progressPercentage)}% away from your monthly goal.`}
              </p>
            </div>
          </div>
        </div>

        <div className="subject-modal__footer">
          <button className="button button--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button button--primary">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

