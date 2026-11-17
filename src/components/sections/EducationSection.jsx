import Icon from '../Icon'

export default function EducationSection() {
  return (
    <section id="education">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="cap" />
            <span>$ cat education.md</span>
          </div>
          <h2>Education</h2>
        </div>
        <div className="reveal">
          <div className="ed-row">
            <Icon name="cap" width={1.7} className="ed-icon" />
            <div className="ed-left">
              <h3>Keshav Memorial Institute of Technology (KMIT)</h3>
              <span>B.Tech, Computer Science and Engineering — CGPA 7.96/10</span>
              <span className="ed-meta">
                Data Structures &amp; Algorithms · Operating Systems · DBMS · Computer Networks ·
                Software Engineering · Cloud Computing (AWS) · Cyber Security
              </span>
            </div>
            <div className="ed-right">
              Hyderabad, India
              <br />
              2023 — 2027
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
