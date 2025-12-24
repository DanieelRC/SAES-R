import "./Stars.css";

export default function Stars({ value = 0, max = 5 }) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push("full");
    } else if (value >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }

  return (
    <div className="stars-container">
      {stars.map((type, idx) => (
        <div key={idx} className={`star-svg ${type}`}>
          <svg viewBox="0 0 24 24" className="svg">
            <defs>
              <linearGradient id={`halfGradient${idx}`} x1="0%" x2="100%">
                <stop offset="50%" stopColor="#f7c948" />
                <stop offset="50%" stopColor="#ccc" />
              </linearGradient>
            </defs>

            <path
              fill={
                type === "full"
                  ? "#f7c948"
                  : type === "half"
                  ? `url(#halfGradient${idx})`
                  : "#ccc"
              }
              d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.73L5.82 21z"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
