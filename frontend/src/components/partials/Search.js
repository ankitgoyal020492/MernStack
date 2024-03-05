import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Search = ({searchVal}) => {
    const [search, setSearch] = useState(searchVal ? searchVal : "");
    const navigate = useNavigate();
    const searchHandler = (e) => {
        setSearch(e.target.value);
    }
    const goToSearchProduct = () => {
        if(search){
            navigate(`/products/${search}`);
        }
    }
    return (
        <>
            <div className="row container">
                <div className="col-md-8 mb-3 mb-md-0">
                    <input type="text" className="form-control py-3" value={search} id="search_inuput123" onChange={searchHandler} placeholder="Search Products" autoComplete='off'/>
                </div>
                <div className="col-md-2 d-grid gap-2 mx-auto">
                    <button className="btn btn-secondary" onClick={goToSearchProduct}>Search</button>
                </div>
            </div>
            <br />
            <br />
        </>
    )
}

export default Search