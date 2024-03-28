import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from "react-router-dom";

export default function Storages({ storages }) {
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
  Storages.propTypes = {
    storages: PropTypes.array.isRequired, // Validate that storages is an array and is required
  };

  return (
    <div className="list-group overflow-y-auto" style={{ maxHeight: '65vh' }}>
      {storages.map(storage => (
        <Link key={storage.storage_name} to={'/storage/' + storage.storage_name} className="list-group-item list-group-item-action">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="/pizza-slice.svg" alt="twbs" className="rounded-circle" style={{ width: '32px', height: '32px', marginRight: '10px' }} />
              <div>
                <h5 className="mb-0 text-uppercase">{storage.storage_name}</h5>
                <small>Items Expiring Soon: {countExpiringItems(storage.items)}</small>
              </div>
            </div>
            <span className="badge bg-primary">{storage.items.length}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
