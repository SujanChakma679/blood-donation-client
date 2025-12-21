import axios from "axios";
import { useEffect, useState } from "react";

const SearchDonors = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // load districts & upazilas
  useEffect(() => {
    axios.get("/upazila.json")
      .then(res => setUpazilas(res.data.upazilas))
      .catch(console.error);

    axios.get("/district.json")
      .then(res => setDistricts(res.data.districts))
      .catch(console.error);
  }, []);

  // filter upazilas by district
  useEffect(() => {
    if (district) {
      const selectedDistrict = districts.find(d => d.name === district);
      if (selectedDistrict) {
        setFilteredUpazilas(
          upazilas.filter(u => u.district_id === selectedDistrict.id)
        );
      }
    } else {
      setFilteredUpazilas([]);
    }
    setUpazila("");
  }, [district, districts, upazilas]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/users/search?blood=${bloodGroup}&district=${district}&upazila=${upazila}`
      );

      const data = await res.json();
      console.log("SEARCH RESULT:", data); // 👈 debug
      setDonors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Blood Donors 🩸</h1>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4 mb-8">

        {/* Blood Group */}
        <select
          className="select select-bordered"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          required
        >
          <option value="">Blood Group</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        {/* District */}
        <select
          className="select select-bordered"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        >
          <option value="">District</option>
          {districts.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        {/* Upazila */}
        <select
          className="select select-bordered"
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          required
        >
          <option value="">Upazila</option>
          {filteredUpazilas.map(u => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </select>

        <button className="btn btn-primary">Search</button>
      </form>

      {/* RESULT SECTION */}
      {searched && (
        <>
          {loading && <p className="text-center">Loading...</p>}

          {!loading && donors.length === 0 && (
            <p className="text-center text-gray-500">
              No donors found 😔
            </p>
          )}

          {!loading && donors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Blood</th>
                    <th>District</th>
                    <th>Upazila</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(donor => (
                    <tr key={donor._id}>
                      <td>{donor.name}</td>
                      <td>{donor.email}</td>
                      <td>{donor.blood}</td> {/* ✅ FIXED */}
                      <td>{donor.district}</td>
                      <td>{donor.upazila}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchDonors;
