import { useState } from "react";

export default function Filter({ onFilterApply }) {
    const [category, setCategory] = useState("all");
    const [cookingTime, setCookingTime] = useState("all");

    const handleApplyFilters = () => {
        onFilterApply({ category, cookingTime });
    };

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="filterOffcanvas">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Filter Recipes</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">All</option>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Cooking Time</label>
                    <select className="form-select" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)}>
                        <option value="all">All</option>
                        <option value="30">Less than 30 mins</option>
                        <option value="60">30-60 mins</option>
                        <option value="60+">More than 60 mins</option>
                    </select>
                </div>
                <button className="btn btn-primary w-100" onClick={handleApplyFilters}>Apply Filters</button>
            </div>
        </div>
    );
}