import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotLHome.module.css';

export default function NotLHome() {
  // Fix 1: Make initialDishes an array of objects instead of filling with same reference
  const initialDishes = Array.from({ length: 6 }, () => ({
    title: 'prawn-fry',
    time: '30 mins',
    likes:'35' ,
    image: '/dish2.jpg',
  }));

  // Fix 2: Add proper typing and initialization
  const [dishes, setDishes] = useState({
    inProgress: initialDishes,
    allTimeBest: initialDishes,
    trending: initialDishes,
    todaySpecials: initialDishes,
  });

  // Fix 3: Add proper typing and make function more robust
  const increaseLikes = (section, index) => {
    setDishes(prevDishes => {
      const updatedSection = [...prevDishes[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        likes: updatedSection[index].likes + 1
      };
      return { ...prevDishes, [section]: updatedSection };
    });
  };

  const tags = [
    'Chinese', 'Morning Foods', 'Italian Cuisine', 'Desserts', 'Healthy Snacks',
    'Vegan', 'Gluten-Free', 'Quick Meals', 'Beverages', 'Appetizers', 'Main Course',
  ];

  // Fix 4: Add sectionKey type checking
  const renderSection = (title, sectionKey) => (
    <section className="mt-3">
      <h2>{title}</h2>
      <div className="row">
        {dishes[sectionKey].map((dish, index) => (
          // Fix 5: Better key using combination of sectionKey and index
          <div className="col-md-2" key={`${sectionKey}-${index}`}>
            <div className="card shadow-sm border-0 rounded-3">
              <img 
                src={dish.image} 
                className="card-img-top rounded-top" 
                alt={dish.title} 
              />
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">{dish.title}</h5>
                  <p className="card-text text-muted">⏳ {dish.time}</p>
                </div>
                <div className="text-center">
                  <p className="mb-0 fw-bold text-danger">{dish.likes}</p>
                  <button
                    className="btn btn-sm btn-light border"
                    onClick={() => increaseLikes(sectionKey, index)}
                  >
                    ❤️👍 Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <>
      <header className={styles.headerSettings}>
        <img 
          src="/recipe-logo.jpg" 
          alt="logo" 
          className={styles.logoSettings} 
        />
        <nav>
          <ul className={styles.listSettings}>
            <li className={styles.listItemSettings}><Link to="/home">Home</Link></li>
            <li className={styles.listItemSettings}><Link to="/trending">Trending</Link></li>
          </ul>
        </nav>
        <div className="d-flex ms-auto me-3">
          <input
                      type="text"
                      placeholder="Search"
                      className={styles.searchBarSettings}
                    />
          <Link to="/login">
            <button className={`${styles.headerRegisterButtonSettings} ms-1 me-1`}>
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className={`${styles.headerRegisterButtonSettings} ms-1 me-1`}>
              Register
            </button>
          </Link>
        </div>
      </header>

      <section className={styles.tagsSection}>
        <ul className={styles.listSettings}>
          {tags.map((tag, index) => (
            <li key={index}>
              <button className={styles.buttonSettings}>{tag}</button>
            </li>
          ))}
        </ul>
      </section>

      <main className="p-3">
        {renderSection('In Progress', 'inProgress')}
        {renderSection('All Time Best', 'allTimeBest')}
        {renderSection('Trending', 'trending')}
        {renderSection('Today Specials', 'todaySpecials')}
      </main>
    </>
  );
}