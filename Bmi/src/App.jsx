
import React, { useState } from "react";
import "./App.css";

const initialData = {
  age: "",
  height: "",
  weight: "",
  waist: "",
  fasting: "",
  postMeal: "",
  systolic: "",
  diastolic: "",
};

function App() {
  const [form, setForm] = useState(initialData);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setReport(null);
    setError("");
  };

  const bmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy range";
    if (bmi < 30) return "Overweight";
    return "Obesity range";
  };

  const bmiAdvice = (bmi) => {
    if (bmi < 18.5)
      return "Discuss your weight and nutritional needs with a healthcare professional.";
    if (bmi < 25)
      return "Maintain balanced nutrition, regular physical activity, and healthy sleep.";
    return "Consider balanced meals and regular activity. Seek personalized advice rather than crash dieting.";
  };

  const sugarCategory = (value, fasting) => {
    // mg/dL; screening categories, not a diagnosis
    if (fasting) {
      if (value < 70) return "Low";
      if (value < 100) return "Normal screening range";
      if (value < 126) return "Elevated — follow up";
      return "Diabetes-range result — confirm with a clinician";
    }

    if (value < 70) return "Low";
    if (value < 140) return "Below the usual 2-hour impaired-glucose threshold";
    if (value < 200) return "Elevated — follow up";
    return "High — prompt clinical assessment";
  };

  const sugarAdvice = (value, fasting) => {
    if (value < 70)
      return "Low glucose can be urgent. If conscious and able to swallow, take 15 g of fast-acting carbohydrate and recheck in 15 minutes. Severe symptoms require emergency help.";
    if (fasting && value >= 126)
      return "A fasting result in this range needs prompt medical follow-up and usually confirmatory testing.";
    if (fasting && value >= 100)
      return "Arrange clinical follow-up. A clinician may recommend repeat fasting glucose or HbA1c.";
    if (!fasting && value >= 200)
      return "Contact a healthcare professional promptly. A 1.5-hour reading alone cannot diagnose diabetes.";
    if (!fasting && value >= 140)
      return "This is not a standardized diagnostic reading at 1.5 hours. Discuss persistent elevations with a clinician.";
    return "Maintain balanced meals and regular activity. Interpret this result alongside symptoms and clinical history.";
  };

  const pressureCategory = (sys, dia) => {
    if (sys < 90 || dia < 60) return "Low blood pressure range";
    if (sys >= 180 || dia >= 120) return "Severely high — urgent assessment";
    if (sys >= 140 || dia >= 90) return "High blood pressure — stage 2 range";
    if (sys >= 130 || dia >= 80) return "High blood pressure — stage 1 range";
    if (sys >= 120 && dia < 80) return "Elevated";
    return "Normal range";
  };

  const pressureAdvice = (sys, dia) => {
    if (sys >= 180 || dia >= 120)
      return "Repeat after at least one minute. If still this high, seek urgent medical care. With chest pain, breathlessness, weakness, confusion, or vision changes, call emergency services immediately.";
    if (sys < 90 || dia < 60)
      return "If you feel dizzy, faint, or weak, seek medical advice. Fainting or severe symptoms need urgent assessment.";
    if (sys >= 130 || dia >= 80)
      return "Arrange a healthcare review and confirm the pattern with properly taken readings on different occasions.";
    if (sys >= 120)
      return "Maintain healthy habits and monitor your blood pressure periodically.";
    return "Continue healthy habits and check blood pressure periodically.";
  };

  const generateReport = (e) => {
    e.preventDefault();
    setError("");
    setReport(null);

    const required = Object.values(form);
    if (required.some((v) => v === "" || !Number.isFinite(Number(v)))) {
      setError("Please complete every field with a valid number.");
      return;
    }

    const d = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, Number(value)])
    );

    if (
      d.age < 1 || d.age > 120 ||
      d.height < 50 || d.height > 250 ||
      d.weight <= 0 || d.weight > 500 ||
      d.waist <= 0 || d.waist > 300 ||
      d.fasting < 0 || d.fasting > 1000 ||
      d.postMeal < 0 || d.postMeal > 1000 ||
      d.systolic <= 0 || d.systolic > 300 ||
      d.diastolic <= 0 || d.diastolic > 200 ||
      d.systolic <= d.diastolic
    ) {
      setError("Check your entries. Use cm, kg, glucose in mg/dL, and BP in mmHg. Systolic must be higher than diastolic.");
      return;
    }

    const bmi = d.weight / ((d.height / 100) ** 2);

    setReport({
      bmi,
      bmiCategory: bmiCategory(bmi),
      bmiAdvice: bmiAdvice(bmi),
      fastingCategory: sugarCategory(d.fasting, true),
      fastingAdvice: sugarAdvice(d.fasting, true),
      postCategory: sugarCategory(d.postMeal, false),
      postAdvice: sugarAdvice(d.postMeal, false),
      bpCategory: pressureCategory(d.systolic, d.diastolic),
      bpAdvice: pressureAdvice(d.systolic, d.diastolic),
      d,
    });
  };

  const reset = () => {
    setForm(initialData);
    setReport(null);
    setError("");
  };

  const Metric = ({ icon, title, value, category, advice }) => (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <h3>{title}</h3>
      <div className="metric-value">{value}</div>
      <span className="status-pill">{category}</span>
      <p>{advice}</p>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✚</span>
          <span>Health<span className="brand-light">Sphere</span></span>
        </div>

        <div className="side-label">WORKSPACE</div>
        <a className="nav-link active" href="#overview">▦ &nbsp; Dashboard</a>
        <a className="nav-link" href="#measurements">♡ &nbsp; Health Metrics</a>
        <a className="nav-link" href="#report">▤ &nbsp; Health Report</a>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span>✦</span>
            <h4>Your health matters</h4>
            <p>Track your measurements and discuss concerns with your clinician.</p>
          </div>
          <p className="side-foot">HEALTHSPHERE · DEMO</p>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <div className="eyebrow">PERSONAL HEALTH MONITORING</div>
            <h1>Health Analytics Dashboard</h1>
            <p className="subtitle">Understand your numbers. Take informed next steps.</p>
          </div>
          <div className="profile">
            <div className="profile-avatar">HS</div>
            <div><strong>Health User</strong><small>Personal dashboard</small></div>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="banner-tag">YOUR WELLNESS, YOUR WAY</span>
            <h2>Small steps. Better health.</h2>
            <p>Enter your measurements to generate a personalized screening summary.</p>
            <a href="#measurements" className="banner-button">Enter your health data ↓</a>
          </div>
          <div className="heart-art" aria-hidden="true">♡</div>
          <div className="banner-orb orb-one" />
          <div className="banner-orb orb-two" />
        </section>

        <section className="section-heading" id="measurements">
          <div>
            <div className="eyebrow">HEALTH PROFILE</div>
            <h2>Enter your measurements</h2>
            <p>All measurements are required for this demo report.</p>
          </div>
          <span className="secure-label">✓ Local calculation</span>
        </section>

        <form onSubmit={generateReport}>
          <div className="form-card">
            <div className="form-section-title">
              <div className="section-icon purple">♧</div>
              <div><h3>Body composition</h3><p>Calculate your body mass index (BMI).</p></div>
            </div>

            <div className="form-grid">
              <Field label="Age" name="age" value={form.age} onChange={update}
                placeholder="e.g. 28" unit="years" />
              <Field label="Height" name="height" value={form.height} onChange={update}
                placeholder="e.g. 165" unit="cm" />
              <Field label="Weight" name="weight" value={form.weight} onChange={update}
                placeholder="e.g. 62" unit="kg" />
              <Field label="Waist circumference" name="waist" value={form.waist} onChange={update}
                placeholder="e.g. 78" unit="cm" />
            </div>

            <div className="form-note">
              <span>ⓘ</span> BMI is a screening measure, not a direct measurement of body fat.
              Waist interpretation depends on sex, ethnicity, and clinical context.
            </div>
          </div>

          <div className="form-card">
            <div className="form-section-title">
              <div className="section-icon orange">◉</div>
              <div><h3>Blood glucose analysis</h3><p>Enter glucose values in mg/dL.</p></div>
            </div>

            <div className="form-grid">
              <Field label="Fasting blood sugar" name="fasting" value={form.fasting}
                onChange={update} placeholder="e.g. 95" unit="mg/dL"
                help="After at least 8 hours without calories." />
              <Field label="Post-meal blood sugar" name="postMeal" value={form.postMeal}
                onChange={update} placeholder="e.g. 135" unit="mg/dL"
                help="Measured 1.5 hours after eating." />
            </div>

            <div className="form-note orange-note">
              <span>ⓘ</span> Standard diagnostic thresholds usually refer to a 2-hour
              oral glucose tolerance test, not an ordinary meal at 1.5 hours.
              These results are not a diagnosis.
            </div>
          </div>

          <div className="form-card">
            <div className="form-section-title">
              <div className="section-icon pink">♡</div>
              <div><h3>Blood pressure</h3><p>Record your blood pressure in mmHg.</p></div>
            </div>

            <div className="form-grid">
              <Field label="Systolic pressure (upper)" name="systolic"
                value={form.systolic} onChange={update} placeholder="e.g. 118" unit="mmHg" />
              <Field label="Diastolic pressure (lower)" name="diastolic"
                value={form.diastolic} onChange={update} placeholder="e.g. 76" unit="mmHg" />
            </div>
            <div className="form-note">
              <span>ⓘ</span> Sit quietly for 5 minutes, use a correctly sized upper-arm cuff,
              and take two readings about one minute apart.
            </div>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <div className="action-row">
            <button type="button" className="reset-button" onClick={reset}>↺ Reset form</button>
            <button type="submit" className="generate-button">Generate Health Report →</button>
          </div>
        </form>

        {report && (
          <section className="report-section" id="report">
            <div className="section-heading">
              <div>
                <div className="eyebrow">YOUR RESULTS</div>
                <h2>Health screening report</h2>
                <p>Based on the values you entered. Not a medical diagnosis.</p>
              </div>
              <button className="print-button" onClick={() => window.print()}>
                ⎙ Print report
              </button>
            </div>

            <div className="report-banner">
              <div className="report-check">✓</div>
              <div>
                <h3>Your report is ready</h3>
                <p>Review each measurement and follow the recommended next steps.</p>
              </div>
            </div>

            <div className="metrics-grid">
              <Metric icon="⚖" title="Body Mass Index"
                value={report.bmi.toFixed(1)} category={report.bmiCategory}
                advice={report.bmiAdvice} />
              <Metric icon="◉" title="Fasting glucose"
                value={`${report.d.fasting} mg/dL`}
                category={report.fastingCategory} advice={report.fastingAdvice} />
              <Metric icon="◉" title="Post-meal glucose"
                value={`${report.d.postMeal} mg/dL`}
                category={report.postCategory} advice={report.postAdvice} />
              <Metric icon="♡" title="Blood pressure"
                value={`${report.d.systolic}/${report.d.diastolic}`}
                category={report.bpCategory} advice={report.bpAdvice} />
            </div>

            <div className="form-card waist-result">
              <h3>Waist measurement</h3>
              <div className="waist-number">{report.d.waist} <small>cm</small></div>
              <p>Waist circumference is useful for assessing abdominal fat-related risk.
                A personalized interpretation requires appropriate age, sex, and population-specific thresholds.</p>
            </div>

            <div className="form-card">
              <h3>Personal wellness recommendations</h3>
              <ul className="recommendations">
                <li><span>01</span><div><strong>Eat balanced meals</strong><p>Include vegetables, fiber-rich foods, suitable protein, and appropriate portions.</p></div></li>
                <li><span>02</span><div><strong>Stay physically active</strong><p>Work toward regular activity, such as walking, according to your ability and clinician's advice.</p></div></li>
                <li><span>03</span><div><strong>Monitor consistently</strong><p>Record readings under comparable conditions and share repeated abnormal results with a healthcare professional.</p></div></li>
                <li><span>04</span><div><strong>Arrange follow-up when needed</strong><p>A clinician may recommend repeat glucose testing, HbA1c, or blood pressure assessment.</p></div></li>
              </ul>
            </div>

            <div className="disclaimer">
              <strong>Important health notice</strong>
              <p>This application provides general educational screening only. It cannot diagnose diabetes,
                hypertension, or other conditions. Do not stop or change prescribed medication based on this report.
                Seek medical care for concerning readings or symptoms.</p>
            </div>
          </section>
        )}

        <footer>HealthSphere © 2026 · Educational health screening demo</footer>
      </main>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, unit, help }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="input-wrap">
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min="0"
          step="any"
          required
        />
        <span className="unit">{unit}</span>
      </div>
      {help && <small className="field-help">{help}</small>}
    </label>
  );
}

export default App;
