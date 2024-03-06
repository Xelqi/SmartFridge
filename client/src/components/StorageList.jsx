import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from "react-router-dom";


export default function StorageList({storages}) {
  // Function to count expiring items in a storage
  function countExpiringItems(items) {
    let count = 0;
    items.forEach(item => {
    if (item.expiryDays <= 3) {
        count++;
    }
    });
    return count;
  }
  
  // PropTypes validation
StorageList.propTypes = {
  storages: PropTypes.array.isRequired, // Validate that storages is an array and is required
};

  return (
    <div className="list-group overflow-y-auto" style={{ height:  '65vh'}}> 
    {/* {'calc(100vh - 57px - 65px)'} */}
      {storages.map(storage => (
        <Link key={storage.storage_name} to={'/storage/' + storage.storage_name} className="list-group-item list-group-item-action d-flex align-items-center justify-content-center">
          <img src="/gem.svg" alt="twbs" className="rounded-circle flex-shrink-0" style={{ width: '32px', height: '32px' }} />
          <div className="flex-grow-1 text-center">
            <h5 className="mb-0 text-uppercase">{storage.storage_name}</h5>
            <small className="mb-1">Items Expiring Soon: { countExpiringItems(storage.items) }</small>
          </div>
          <span className="badge bg-primary bg-secondary">{storage.items.length}</span>
        </Link>
      ))}
    </div>
  );

}

