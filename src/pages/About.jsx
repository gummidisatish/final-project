import Navbar from "../components/Navbar";
import "../styles.css";

export default function About() {
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <main className="about-page" aria-label="About Us Section">
                <div className="container">
                    <header>
                        <h1 className="about-title">About Us</h1>
                    </header>
                    <section className="about-content">
                        <p className="about-description">
                            Welcome to the <strong>Recipe Sharing Platform</strong>, where food lovers unite to share and discover exceptional recipes! Whether you’re a culinary expert or just starting out, our platform is crafted to inspire creativity and foster connections within a vibrant community of passionate cooks.
                        </p>
                        <div className="about-features" role="region" aria-labelledby="features-title">
                            <h2 className="features-title" id="features-title">Why Choose Our Platform?</h2>
                            <ul className="features-list" role="list">
                                {[
                                    {
                                        icon: "📌",
                                        text: "Share your cherished recipes with a global audience",
                                    },
                                    {
                                        icon: "🔥",
                                        text: "Explore trending dishes and uncover new culinary delights",
                                    },
                                    {
                                        icon: "❤️",
                                        text: "Save and like recipes to build your personalized collection",
                                    },
                                    {
                                        icon: "👨‍🍳",
                                        text: "Follow top chefs and draw inspiration from their expertise",
                                    },
                                ].map((feature, index) => (
                                    <li key={index} className="feature-item">
                                        <span 
                                            className="feature-icon" 
                                            role="img" 
                                            aria-hidden="true"
                                        >
                                            {feature.icon}
                                        </span>
                                        <span className="feature-text">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}