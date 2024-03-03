function ShoppingList() {
  return (
    <div className="row">
        <div className="col-12 text-center">
            <h1 style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Shopping Lists</h1>
        </div>
        <div className="col-12">
            <div className="d-flex justify-content-end">
                <img src="/sort.svg" alt="" />
            </div>
        </div>
        <div className="col-12">
            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex">
                        <img className="mb-2" src="/groc_64_w.png" alt=""  style={{height: "45px"}}/>
                        <div className="ms-2 mb-1">
                        <h5 className="mb-0 ms-3" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Weekly Shop</h5>
                        <small className="ms-3 text-body-black" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>4 items left</small>
                        </div>
                        <div className="flex-grow-1"></div>
                        <img className="mb-2 ms-auto" src="/arrow_foward.svg" alt="" />
                    </div>
                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{height: "5px"}}>
                        <div className="progress-bar w-75 bg-body-white"></div>
                    </div>
                </a>
            </div>
        </div>
    </div>
  )
}

export default ShoppingList