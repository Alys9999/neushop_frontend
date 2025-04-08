import React, { useState, useEffect } from "react";

const BASEURL = "https://db-group5-452710.wl.r.appspot.com";

/**
 * A simple App component that contains each table's CRUD section.
 */
export default function App() {
  return (
    <div style={{ margin: "20px" }}>
      <h1>Neushop CRUD Admin</h1>
      <UserCrudSection />
      <CustomerCrudSection />
      <SellerCrudSection />
      <AdminCrudSection />
      <CategoryCrudSection />
      <CartCrudSection />
      <ProductCrudSection />
      <OrderCrudSection />
      <OrderItemCrudSection />
      <PaymentCrudSection />
    </div>
  );
}

/* ------------------------------------------------------------------
   1) USER CRUD SECTION
   Table columns: 
     - user_id (PK), username, password, email, created_at
   Insertable columns:
     - user_id, username, password, email
------------------------------------------------------------------ */
function UserCrudSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // For creating a new user
  const [newUser, setNewUser] = useState({
    user_id: "",
    username: "",
    password: "",
    email: "",
  });

  // For editing an existing user
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  // Load all users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/user`);
      const data = await resp.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
    setLoading(false);
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm(`Delete user with ID ${userId}?`)) return;
    try {
      await fetch(`${BASEURL}/USER/${userId}`, {
        method: "DELETE",
      });
      // Refresh list
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Create a new user
  const createUser = async () => {
    try {
      await fetch(`${BASEURL}/USER`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      // Clear form
      setNewUser({
        user_id: "",
        username: "",
        password: "",
        email: "",
      });
      // Reload
      loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Start editing a user
  const startEdit = (user) => {
    setEditUserId(user.user_id);
    setEditForm({
      username: user.username || "",
      password: user.password || "",
      email: user.email || "",
    });
  };

  // Submit update
  const updateUser = async (userId) => {
    try {
      await fetch(`${BASEURL}/USER/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditUserId(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>USER Table</h2>
      <button onClick={loadUsers} disabled={loading}>
        {loading ? "Loading..." : "Load All USERS"}
      </button>

      {/* Display users in a table */}
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>user_id</th>
            <th>username</th>
            <th>password</th>
            <th>email</th>
            <th>created_at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              {/* If this is the row we are editing, show input fields */}
              {editUserId === u.user_id ? (
                <>
                  <td>
                    <input
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm({ ...editForm, password: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{u.username}</td>
                  <td>{u.password}</td>
                  <td>{u.email}</td>
                </>
              )}

              <td>{u.created_at}</td>
              <td>
                {editUserId === u.user_id ? (
                  <>
                    <button onClick={() => updateUser(u.user_id)}>
                      Save
                    </button>
                    <button onClick={() => setEditUserId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)}>Update</button>
                    <button onClick={() => deleteUser(u.user_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create new user form */}
      <h4>Create New User</h4>
      <div>
        <label>user_id: </label>
        <input
          value={newUser.user_id}
          onChange={(e) => setNewUser({ ...newUser, user_id: e.target.value })}
        />
      </div>
      <div>
        <label>username: </label>
        <input
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
      </div>
      <div>
        <label>password: </label>
        <input
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
      </div>
      <div>
        <label>email: </label>
        <input
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>
      <button onClick={createUser}>Create User</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   2) CUSTOMER CRUD SECTION
   Columns: user_id (PK), first_name, last_name, phone
   Insertable: user_id, first_name, last_name, phone
------------------------------------------------------------------ */
function CustomerCrudSection() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/customers`);
      const data = await resp.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm(`Delete CUSTOMER with user_id=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/CUSTOMER/${id}`, {
        method: "DELETE",
      });
      loadCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const createCustomer = async () => {
    try {
      await fetch(`${BASEURL}/CUSTOMER`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      setNewCustomer({
        user_id: "",
        first_name: "",
        last_name: "",
        phone: "",
      });
      loadCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (cust) => {
    setEditId(cust.user_id);
    setEditForm({
      first_name: cust.first_name || "",
      last_name: cust.last_name || "",
      phone: cust.phone || "",
    });
  };

  const updateCustomer = async (id) => {
    try {
      await fetch(`${BASEURL}/CUSTOMER/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      loadCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>CUSTOMER Table</h2>
      <button onClick={loadCustomers} disabled={loading}>
        {loading ? "Loading..." : "Load All CUSTOMERS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>user_id</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.user_id}>
              <td>{c.user_id}</td>
              {editId === c.user_id ? (
                <>
                  <td>
                    <input
                      value={editForm.first_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, first_name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.last_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, last_name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{c.first_name}</td>
                  <td>{c.last_name}</td>
                  <td>{c.phone}</td>
                </>
              )}
              <td>
                {editId === c.user_id ? (
                  <>
                    <button onClick={() => updateCustomer(c.user_id)}>
                      Save
                    </button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(c)}>Update</button>
                    <button onClick={() => deleteCustomer(c.user_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Customer</h4>
      <div>
        <label>user_id: </label>
        <input
          value={newCustomer.user_id}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, user_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>first_name: </label>
        <input
          value={newCustomer.first_name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, first_name: e.target.value })
          }
        />
      </div>
      <div>
        <label>last_name: </label>
        <input
          value={newCustomer.last_name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, last_name: e.target.value })
          }
        />
      </div>
      <div>
        <label>phone: </label>
        <input
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
        />
      </div>
      <button onClick={createCustomer}>Create Customer</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   3) SELLER CRUD SECTION
   Columns: user_id (PK), store_name, business_license
   Insertable: user_id, store_name, business_license
------------------------------------------------------------------ */
function SellerCrudSection() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newSeller, setNewSeller] = useState({
    user_id: "",
    store_name: "",
    business_license: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    store_name: "",
    business_license: "",
  });

  const loadSellers = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/sellers`);
      const data = await resp.json();
      setSellers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteSeller = async (id) => {
    if (!window.confirm(`Delete SELLER with user_id=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/SELLER/${id}`, {
        method: "DELETE",
      });
      loadSellers();
    } catch (err) {
      console.error(err);
    }
  };

  const createSeller = async () => {
    try {
      await fetch(`${BASEURL}/SELLER`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSeller),
      });
      setNewSeller({
        user_id: "",
        store_name: "",
        business_license: "",
      });
      loadSellers();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (seller) => {
    setEditId(seller.user_id);
    setEditForm({
      store_name: seller.store_name || "",
      business_license: seller.business_license || "",
    });
  };

  const updateSeller = async (id) => {
    try {
      await fetch(`${BASEURL}/SELLER/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      loadSellers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>SELLER Table</h2>
      <button onClick={loadSellers} disabled={loading}>
        {loading ? "Loading..." : "Load All SELLERS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>user_id</th>
            <th>store_name</th>
            <th>business_license</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.user_id}>
              <td>{s.user_id}</td>
              {editId === s.user_id ? (
                <>
                  <td>
                    <input
                      value={editForm.store_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          store_name: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.business_license}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          business_license: e.target.value,
                        })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{s.store_name}</td>
                  <td>{s.business_license}</td>
                </>
              )}
              <td>
                {editId === s.user_id ? (
                  <>
                    <button onClick={() => updateSeller(s.user_id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(s)}>Update</button>
                    <button onClick={() => deleteSeller(s.user_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {sellers.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Seller</h4>
      <div>
        <label>user_id: </label>
        <input
          value={newSeller.user_id}
          onChange={(e) =>
            setNewSeller({ ...newSeller, user_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>store_name: </label>
        <input
          value={newSeller.store_name}
          onChange={(e) =>
            setNewSeller({ ...newSeller, store_name: e.target.value })
          }
        />
      </div>
      <div>
        <label>business_license: </label>
        <input
          value={newSeller.business_license}
          onChange={(e) =>
            setNewSeller({
              ...newSeller,
              business_license: e.target.value,
            })
          }
        />
      </div>
      <button onClick={createSeller}>Create Seller</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   4) ADMIN CRUD SECTION
   Columns: user_id (PK), admin_level
   Insertable: user_id, admin_level
------------------------------------------------------------------ */
function AdminCrudSection() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    user_id: "",
    admin_level: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    admin_level: "",
  });

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/admins`);
      const data = await resp.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm(`Delete ADMIN with user_id=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/ADMIN/${id}`, {
        method: "DELETE",
      });
      loadAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const createAdmin = async () => {
    try {
      await fetch(`${BASEURL}/ADMIN`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      setNewAdmin({
        user_id: "",
        admin_level: "",
      });
      loadAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (admin) => {
    setEditId(admin.user_id);
    setEditForm({
      admin_level: admin.admin_level || "",
    });
  };

  const updateAdmin = async (id) => {
    try {
      await fetch(`${BASEURL}/ADMIN/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      loadAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>ADMIN Table</h2>
      <button onClick={loadAdmins} disabled={loading}>
        {loading ? "Loading..." : "Load All ADMINS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>user_id</th>
            <th>admin_level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.user_id}>
              <td>{a.user_id}</td>
              {editId === a.user_id ? (
                <td>
                  <input
                    value={editForm.admin_level}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        admin_level: e.target.value,
                      })
                    }
                  />
                </td>
              ) : (
                <td>{a.admin_level}</td>
              )}
              <td>
                {editId === a.user_id ? (
                  <>
                    <button onClick={() => updateAdmin(a.user_id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(a)}>Update</button>
                    <button onClick={() => deleteAdmin(a.user_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {admins.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Admin</h4>
      <div>
        <label>user_id: </label>
        <input
          value={newAdmin.user_id}
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, user_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>admin_level: </label>
        <input
          value={newAdmin.admin_level}
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, admin_level: e.target.value })
          }
        />
      </div>
      <button onClick={createAdmin}>Create Admin</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   5) CATEGORY CRUD SECTION
   Columns: category_id (PK), category_name, description
   Insertable: category_id, category_name, description
------------------------------------------------------------------ */
function CategoryCrudSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newCategory, setNewCategory] = useState({
    category_id: "",
    category_name: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    category_name: "",
    description: "",
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/categories`);
      const data = await resp.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm(`Delete CATEGORY with ID=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/CATEGORY/${id}`, {
        method: "DELETE",
      });
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = async () => {
    try {
      await fetch(`${BASEURL}/CATEGORY`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      setNewCategory({
        category_id: "",
        category_name: "",
        description: "",
      });
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat.category_id);
    setEditForm({
      category_name: cat.category_name || "",
      description: cat.description || "",
    });
  };

  const updateCategory = async (id) => {
    try {
      await fetch(`${BASEURL}/CATEGORY/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>CATEGORY Table</h2>
      <button onClick={loadCategories} disabled={loading}>
        {loading ? "Loading..." : "Load All CATEGORIES"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>category_id</th>
            <th>category_name</th>
            <th>description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.category_id}>
              <td>{c.category_id}</td>
              {editId === c.category_id ? (
                <>
                  <td>
                    <input
                      value={editForm.category_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category_name: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{c.category_name}</td>
                  <td>{c.description}</td>
                </>
              )}
              <td>
                {editId === c.category_id ? (
                  <>
                    <button onClick={() => updateCategory(c.category_id)}>
                      Save
                    </button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(c)}>Update</button>
                    <button onClick={() => deleteCategory(c.category_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Category</h4>
      <div>
        <label>category_id: </label>
        <input
          value={newCategory.category_id}
          onChange={(e) =>
            setNewCategory({ ...newCategory, category_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>category_name: </label>
        <input
          value={newCategory.category_name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, category_name: e.target.value })
          }
        />
      </div>
      <div>
        <label>description: </label>
        <input
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
      </div>
      <button onClick={createCategory}>Create Category</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   6) CART CRUD SECTION
   Columns: cart_id (PK), created_at, user_id
   Insertable: cart_id, user_id
------------------------------------------------------------------ */
function CartCrudSection() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newCart, setNewCart] = useState({
    cart_id: "",
    user_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    user_id: "",
  });

  const loadCarts = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/carts`);
      const data = await resp.json();
      setCarts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteCart = async (id) => {
    if (!window.confirm(`Delete CART with ID=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/CART/${id}`, {
        method: "DELETE",
      });
      loadCarts();
    } catch (err) {
      console.error(err);
    }
  };

  const createCart = async () => {
    try {
      await fetch(`${BASEURL}/CART`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCart),
      });
      setNewCart({
        cart_id: "",
        user_id: "",
      });
      loadCarts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (cart) => {
    setEditId(cart.cart_id);
    setEditForm({
      user_id: cart.user_id || "",
    });
  };

  const updateCart = async (id) => {
    try {
      await fetch(`${BASEURL}/CART/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      loadCarts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>CART Table</h2>
      <button onClick={loadCarts} disabled={loading}>
        {loading ? "Loading..." : "Load All CARTS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>cart_id</th>
            <th>created_at</th>
            <th>user_id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((c) => (
            <tr key={c.cart_id}>
              <td>{c.cart_id}</td>
              <td>{c.created_at}</td>
              {editId === c.cart_id ? (
                <td>
                  <input
                    value={editForm.user_id}
                    onChange={(e) =>
                      setEditForm({ ...editForm, user_id: e.target.value })
                    }
                  />
                </td>
              ) : (
                <td>{c.user_id}</td>
              )}
              <td>
                {editId === c.cart_id ? (
                  <>
                    <button onClick={() => updateCart(c.cart_id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(c)}>Update</button>
                    <button onClick={() => deleteCart(c.cart_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {carts.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Cart</h4>
      <div>
        <label>cart_id: </label>
        <input
          value={newCart.cart_id}
          onChange={(e) => setNewCart({ ...newCart, cart_id: e.target.value })}
        />
      </div>
      <div>
        <label>user_id: </label>
        <input
          value={newCart.user_id}
          onChange={(e) => setNewCart({ ...newCart, user_id: e.target.value })}
        />
      </div>
      <button onClick={createCart}>Create Cart</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   7) PRODUCT CRUD SECTION
   Columns: 
     product_id (PK), name, price, description, stock_quantity, 
     created_at, user_id, category_id
   Insertable: 
     product_id, name, price, description, stock_quantity, user_id, category_id
------------------------------------------------------------------ */
function ProductCrudSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    product_id: "",
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
    user_id: "",
    category_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
    user_id: "",
    category_id: "",
  });

  // Load all products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/products`);
      const data = await resp.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Delete a product
  const deleteProduct = async (id) => {
    if (!window.confirm(`Delete PRODUCT with ID=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/PRODUCT/${id}`, {
        method: "DELETE",
      });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Create a product
  const createProduct = async () => {
    try {
      // Convert price, stock_quantity to numeric if needed
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        stock_quantity: parseInt(newProduct.stock_quantity) || 0,
      };

      await fetch(`${BASEURL}/PRODUCT`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Clear form
      setNewProduct({
        product_id: "",
        name: "",
        price: "",
        description: "",
        stock_quantity: "",
        user_id: "",
        category_id: "",
      });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (p) => {
    setEditId(p.product_id);
    setEditForm({
      name: p.name || "",
      price: p.price || "",
      description: p.description || "",
      stock_quantity: p.stock_quantity || "",
      user_id: p.user_id || "",
      category_id: p.category_id || "",
    });
  };

  // Submit update
  const updateProduct = async (id) => {
    try {
      const payload = {
        ...editForm,
        price: parseFloat(editForm.price) || 0,
        stock_quantity: parseInt(editForm.stock_quantity) || 0,
      };
      await fetch(`${BASEURL}/PRODUCT/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>PRODUCT Table</h2>
      <button onClick={loadProducts} disabled={loading}>
        {loading ? "Loading..." : "Load All PRODUCTS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>product_id</th>
            <th>name</th>
            <th>price</th>
            <th>description</th>
            <th>stock_quantity</th>
            <th>created_at</th>
            <th>user_id</th>
            <th>category_id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              {editId === p.product_id ? (
                <>
                  <td>
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.stock_quantity}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          stock_quantity: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>{p.created_at}</td>
                  <td>
                    <input
                      value={editForm.user_id}
                      onChange={(e) =>
                        setEditForm({ ...editForm, user_id: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.category_id}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category_id: e.target.value,
                        })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.description}</td>
                  <td>{p.stock_quantity}</td>
                  <td>{p.created_at}</td>
                  <td>{p.user_id}</td>
                  <td>{p.category_id}</td>
                </>
              )}
              <td>
                {editId === p.product_id ? (
                  <>
                    <button onClick={() => updateProduct(p.product_id)}>
                      Save
                    </button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(p)}>Update</button>
                    <button onClick={() => deleteProduct(p.product_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Product</h4>
      <div>
        <label>product_id: </label>
        <input
          value={newProduct.product_id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, product_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>name: </label>
        <input
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
      </div>
      <div>
        <label>price: </label>
        <input
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
      </div>
      <div>
        <label>description: </label>
        <input
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
      </div>
      <div>
        <label>stock_quantity: </label>
        <input
          value={newProduct.stock_quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock_quantity: e.target.value })
          }
        />
      </div>
      <div>
        <label>user_id: </label>
        <input
          value={newProduct.user_id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, user_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>category_id: </label>
        <input
          value={newProduct.category_id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category_id: e.target.value })
          }
        />
      </div>
      <button onClick={createProduct}>Create Product</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   8) ORDER CRUD SECTION
   Columns: order_id (PK), order_date, status, total_amount, user_id
   Insertable: order_id, status, total_amount, user_id
------------------------------------------------------------------ */
function OrderCrudSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newOrder, setNewOrder] = useState({
    order_id: "",
    status: "",
    total_amount: "",
    user_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    total_amount: "",
    user_id: "",
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/orders`);
      const data = await resp.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteOrder = async (id) => {
    if (!window.confirm(`Delete ORDER with ID=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/ORDER/${id}`, {
        method: "DELETE",
      });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const createOrder = async () => {
    try {
      const payload = {
        ...newOrder,
        total_amount: parseFloat(newOrder.total_amount) || 0,
      };
      await fetch(`${BASEURL}/ORDER`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setNewOrder({
        order_id: "",
        status: "",
        total_amount: "",
        user_id: "",
      });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (o) => {
    setEditId(o.order_id);
    setEditForm({
      status: o.status || "",
      total_amount: o.total_amount || "",
      user_id: o.user_id || "",
    });
  };

  const updateOrder = async (id) => {
    try {
      const payload = {
        ...editForm,
        total_amount: parseFloat(editForm.total_amount) || 0,
      };
      await fetch(`${BASEURL}/ORDER/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditId(null);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>ORDER Table</h2>
      <button onClick={loadOrders} disabled={loading}>
        {loading ? "Loading..." : "Load All ORDERS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>status</th>
            <th>total_amount</th>
            <th>user_id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td>
              <td>{o.order_date}</td>
              {editId === o.order_id ? (
                <>
                  <td>
                    <input
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.total_amount}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          total_amount: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.user_id}
                      onChange={(e) =>
                        setEditForm({ ...editForm, user_id: e.target.value })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{o.status}</td>
                  <td>{o.total_amount}</td>
                  <td>{o.user_id}</td>
                </>
              )}

              <td>
                {editId === o.order_id ? (
                  <>
                    <button onClick={() => updateOrder(o.order_id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(o)}>Update</button>
                    <button onClick={() => deleteOrder(o.order_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Order</h4>
      <div>
        <label>order_id: </label>
        <input
          value={newOrder.order_id}
          onChange={(e) => setNewOrder({ ...newOrder, order_id: e.target.value })}
        />
      </div>
      <div>
        <label>status: </label>
        <input
          value={newOrder.status}
          onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
        />
      </div>
      <div>
        <label>total_amount: </label>
        <input
          value={newOrder.total_amount}
          onChange={(e) =>
            setNewOrder({ ...newOrder, total_amount: e.target.value })
          }
        />
      </div>
      <div>
        <label>user_id: </label>
        <input
          value={newOrder.user_id}
          onChange={(e) => setNewOrder({ ...newOrder, user_id: e.target.value })}
        />
      </div>
      <button onClick={createOrder}>Create Order</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   9) ORDERITEM CRUD SECTION
   Columns: order_item_id (PK), quantity, item_price, order_id, product_id
   Insertable: order_item_id, quantity, item_price, order_id, product_id
------------------------------------------------------------------ */
function OrderItemCrudSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newItem, setNewItem] = useState({
    order_item_id: "",
    quantity: "",
    item_price: "",
    order_id: "",
    product_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    quantity: "",
    item_price: "",
    order_id: "",
    product_id: "",
  });

  const loadItems = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/orderitems`);
      const data = await resp.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    if (!window.confirm(`Delete ORDERITEM with ID=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/ORDERITEM/${id}`, {
        method: "DELETE",
      });
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const createItem = async () => {
    try {
      const payload = {
        ...newItem,
        quantity: parseInt(newItem.quantity) || 0,
        item_price: parseFloat(newItem.item_price) || 0,
      };
      await fetch('${BASEURL}/ORDERITEM', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setNewItem({
        order_item_id: "",
        quantity: "",
        item_price: "",
        order_id: "",
        product_id: "",
      });
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item) => {
    setEditId(item.order_item_id);
    setEditForm({
      quantity: item.quantity || "",
      item_price: item.item_price || "",
      order_id: item.order_id || "",
      product_id: item.product_id || "",
    });
  };

  const updateItem = async (id) => {
    try {
      const payload = {
        ...editForm,
        quantity: parseInt(editForm.quantity) || 0,
        item_price: parseFloat(editForm.item_price) || 0,
      };
      await fetch(`${BASEURL}/ORDERITEM/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditId(null);
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>ORDERITEM Table</h2>
      <button onClick={loadItems} disabled={loading}>
        {loading ? "Loading..." : "Load All ORDERITEMS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>order_item_id</th>
            <th>quantity</th>
            <th>item_price</th>
            <th>order_id</th>
            <th>product_id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.order_item_id}>
              <td>{it.order_item_id}</td>
              {editId === it.order_item_id ? (
                <>
                  <td>
                    <input
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quantity: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.item_price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, item_price: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.order_id}
                      onChange={(e) =>
                        setEditForm({ ...editForm, order_id: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.product_id}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          product_id: e.target.value,
                        })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{it.quantity}</td>
                  <td>{it.item_price}</td>
                  <td>{it.order_id}</td>
                  <td>{it.product_id}</td>
                </>
              )}
              <td>
                {editId === it.order_item_id ? (
                  <>
                    <button onClick={() => updateItem(it.order_item_id)}>
                      Save
                    </button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(it)}>Update</button>
                    <button onClick={() => deleteItem(it.order_item_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New OrderItem</h4>
      <div>
        <label>order_item_id: </label>
        <input
          value={newItem.order_item_id}
          onChange={(e) =>
            setNewItem({ ...newItem, order_item_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>quantity: </label>
        <input
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
      </div>
      <div>
        <label>item_price: </label>
        <input
          value={newItem.item_price}
          onChange={(e) =>
            setNewItem({ ...newItem, item_price: e.target.value })
          }
        />
      </div>
      <div>
        <label>order_id: </label>
        <input
          value={newItem.order_id}
          onChange={(e) => setNewItem({ ...newItem, order_id: e.target.value })}
        />
      </div>
      <div>
        <label>product_id: </label>
        <input
          value={newItem.product_id}
          onChange={(e) =>
            setNewItem({ ...newItem, product_id: e.target.value })
          }
        />
      </div>
      <button onClick={createItem}>Create OrderItem</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   10) PAYMENT CRUD SECTION
   Columns: payment_id (PK), payment_date, payment_amount, payment_method
   Insertable: payment_id, payment_amount, payment_method
------------------------------------------------------------------ */
function PaymentCrudSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newPayment, setNewPayment] = useState({
    payment_id: "",
    payment_amount: "",
    payment_method: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    payment_amount: "",
    payment_method: "",
  });

  const loadPayments = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASEURL}/payments`);
      const data = await resp.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deletePayment = async (id) => {
    if (!window.confirm(`Delete PAYMENT with ID=${id}?`)) return;
    try {
      await fetch(`${BASEURL}/PAYMENT/${id}`, {
        method: "DELETE",
      });
      loadPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const createPayment = async () => {
    try {
      const payload = {
        ...newPayment,
        payment_amount: parseFloat(newPayment.payment_amount) || 0,
      };
      await fetch(`${BASEURL}/PAYMENT`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setNewPayment({
        payment_id: "",
        payment_amount: "",
        payment_method: "",
      });
      loadPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p) => {
    setEditId(p.payment_id);
    setEditForm({
      payment_amount: p.payment_amount || "",
      payment_method: p.payment_method || "",
    });
  };

  const updatePayment = async (id) => {
    try {
      const payload = {
        ...editForm,
        payment_amount: parseFloat(editForm.payment_amount) || 0,
      };
      await fetch(`${BASEURL}/PAYMENT/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditId(null);
      loadPayments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>PAYMENT Table</h2>
      <button onClick={loadPayments} disabled={loading}>
        {loading ? "Loading..." : "Load All PAYMENTS"}
      </button>
      <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>payment_id</th>
            <th>payment_date</th>
            <th>payment_amount</th>
            <th>payment_method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.payment_id}</td>
              <td>{p.payment_date}</td>
              {editId === p.payment_id ? (
                <>
                  <td>
                    <input
                      value={editForm.payment_amount}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          payment_amount: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.payment_method}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          payment_method: e.target.value,
                        })
                      }
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{p.payment_amount}</td>
                  <td>{p.payment_method}</td>
                </>
              )}
              <td>
                {editId === p.payment_id ? (
                  <>
                    <button onClick={() => updatePayment(p.payment_id)}>
                      Save
                    </button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(p)}>Update</button>
                    <button onClick={() => deletePayment(p.payment_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4>Create New Payment</h4>
      <div>
        <label>payment_id: </label>
        <input
          value={newPayment.payment_id}
          onChange={(e) =>
            setNewPayment({ ...newPayment, payment_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>payment_amount: </label>
        <input
          value={newPayment.payment_amount}
          onChange={(e) =>
            setNewPayment({
              ...newPayment,
              payment_amount: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label>payment_method: </label>
        <input
          value={newPayment.payment_method}
          onChange={(e) =>
            setNewPayment({
              ...newPayment,
              payment_method: e.target.value,
            })
          }
        />
      </div>
      <button onClick={createPayment}>Create Payment</button>
    </div>
  );
}
