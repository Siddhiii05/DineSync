import "../styles/Loader.css";

export default function Loader({ text }) {
    return (
        <div className="loader-container">
            <div className="loading-spinner"></div>

            <p className="loader-text">
                {text}
            </p>
        </div>
    );
}