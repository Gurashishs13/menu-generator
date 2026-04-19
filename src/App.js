import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import categories from "./menuData";

/* ---------- FORMAT ITEMS ---------- */
const formatItems = (items) => {
  let currentType = "veg";
  return items
    .map((item) => {
      if (item === "NON VEG") {
        currentType = "non-veg";
        return null;
      }
      return { name: item, type: currentType };
    })
    .filter(Boolean);
};

function App() {
  const [selected, setSelected] = useState({});
  const [event, setEvent] = useState({
    date: "",
    venue: "",
    gathering: "",
  });
  const [showBreakfast, setShowBreakfast] = useState(false);

  /* ---------- SELECT ---------- */
  const handleCheckbox = (cat, dish) => {
    setSelected((prev) => {
      const list = prev[cat] || [];
      return {
        ...prev,
        [cat]: list.includes(dish)
          ? list.filter((d) => d !== dish)
          : [...list, dish],
      };
    });
  };

  /* ---------- PDF ---------- */
const generatePDF = async () => {
  const input = document.getElementById("menu-preview");

const canvas = await html2canvas(input, {
  scale: 2,
  useCORS: true,   // ✅ IMPORTANT
});

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth() - 20;
  const pageHeight = pdf.internal.pageSize.getHeight() - 20;

  const imgProps = pdf.getImageProperties(imgData);

  let imgWidth = pageWidth;
  let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  // 🔥 SCALE DOWN if height exceeds page
  if (imgHeight > pageHeight) {
    const scaleFactor = pageHeight / imgHeight;
    imgHeight = pageHeight;
    imgWidth = imgWidth * scaleFactor;
  }

  const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

  pdf.addImage(imgData, "PNG", x, 10, imgWidth, imgHeight);

  // ✅ Dynamic filename
  const date = event.date || "NoDate";
  const venue = event.venue || "NoVenue";

  const fileName = `${date}-${venue}.pdf`.replace(/\s+/g, "_");

  pdf.save(fileName);
};
  return (
    <div style={mainContainer}>
      {/* HEADER */}
      <h1 style={mainTitle}>GB Caterers</h1>
      <p style={subtitle}>Premium Catering Experience</p>

      {/* EVENT DETAILS */}
      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <input
          placeholder="Date"
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Venue"
          onChange={(e) => setEvent({ ...event, venue: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Guests"
          onChange={(e) => setEvent({ ...event, gathering: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* BREAKFAST */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>
          <input
            type="checkbox"
            checked={showBreakfast}
            onChange={() => setShowBreakfast(!showBreakfast)}
            style={{ marginRight: 8 }}
          />
          Include Breakfast
        </label>
      </div>

      {/* BUTTONS */}
      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <button style={btnStyle} onClick={generatePDF}>
          Download PDF 📄
        </button>

        <button style={btnStyle} onClick={() => window.print()}>
          Print 🖨️
        </button>

        <button style={clearBtn} onClick={() => setSelected({})}>
          Clear ❌
        </button>
      </div>

      {/* MENU SELECTION */}
      <div style={gridStyle}>
        {Object.keys(categories).map((cat) => {
          if (cat === "Breakfast" && !showBreakfast) return null;

          return (
            <div key={cat} style={cardStyle}>
              <h3 style={cardTitle}>
                {cat === "HotCold" ? "HOT & COLD" : cat.toUpperCase()}
              </h3>

              {formatItems(categories[cat]).map((item) => (
                <label key={item.name} style={itemStyle}>
                  <input
                    type="checkbox"
                    checked={selected[cat]?.includes(item.name) || false}
                    onChange={() => handleCheckbox(cat, item.name)}
                  />
                  {item.name} {item.type === "veg" ? "🟢" : "🔴"}
                </label>
              ))}
            </div>
          );
        })}
      </div>

      {/* PREVIEW */}
{/* PREVIEW */}
<div id="menu-preview" style={previewStyle}>

  {/* HEADER */}
  <div style={{ textAlign: "center", marginBottom: 10 }}>
    <h1 style={previewTitle}>GB Caterers</h1>

    <p style={{ margin: 3, fontSize: 13 }}>
      Premium Catering Experience
    </p>

    <p style={{ fontSize: 11, color: "#888" }}>
      Making Every Occasion Special ✨
    </p>

    <hr style={divider} />
  </div>
        {/* EVENT */}
        <p style={eventStyle}>
          {event.date} | {event.venue} <br />
          👥 Guests: <strong>{event.gathering}</strong>
        </p>

        {/* EMPTY CHECK */}
        {Object.keys(selected).length === 0 && (
          <p style={{ textAlign: "center" }}>No items selected</p>
        )}

        {/* MENU GRID */}
        <div style={menuGrid}>
          {Object.keys(selected).map((cat) => (
<div key={cat} style={{ marginBottom: 15 }}>
  <h3 style={catStyle}>
    {cat === "HotCold" ? "HOT & COLD" : cat.toUpperCase()}
  </h3>

  <hr style={{ border: "0.5px solid #eee", marginBottom: 6 }} />
              {selected[cat].map((dish) => (
                <p
  key={dish}
  style={{
    margin: "4px 0",
    fontSize: 15,
    letterSpacing: 0.3,
  }}
>
  • {dish}
</p>
              ))}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <hr style={divider} />

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <b>Harpreet Singh 'Babloo'</b>
          <p>📞 +91 9414500313</p>
          <p>📍 14 Mukherji Nagar, Sriganganagar</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const mainContainer = {
  background: "#f8f6ea",
  minHeight: "100vh",
  padding: 30,
  fontFamily: "serif",
  color: "#6b4f1d",
};

const mainTitle = {
  textAlign: "center",
  color: "#c9a74d",
  fontSize: 42,
  letterSpacing: 2,
};

const subtitle = {
  textAlign: "center",
  marginBottom: 25,
  color: "#a8893c",
};

const inputStyle = {
  margin: 8,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #c9a74d",
};

const btnStyle = {
  margin: 8,
  padding: "10px 22px",
  borderRadius: 8,
  border: "none",
  background: "#c9a74d",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const clearBtn = {
  margin: 8,
  padding: "10px 22px",
  borderRadius: 8,
  border: "none",
  background: "#999",
  color: "white",
};

const gridStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 20,
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #e0c97a",
  borderRadius: 10,
  padding: 15,
  width: 220,
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
};

const cardTitle = {
  color: "#c9a74d",
  textAlign: "center",
};

const itemStyle = {
  display: "block",
  marginBottom: 6,
};

const previewStyle = {
  background: "#fffdf7",
  marginTop: 40,
  padding: 40,
  maxWidth: 850,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: 12,
  border: "1px solid #e0c97a",
  boxShadow: "0 0 0 2px #f0e2b6 inset",
};



const previewTitle = {
  color: "#c9a74d",
  fontSize: 38,
  letterSpacing: 3,
  fontWeight: "bold",
};

const divider = {
  border: "1px solid #e0c97a",
  margin: "10px 0",
};

const eventStyle = {
  textAlign: "center",
  marginBottom: 15,
};

const menuGrid = {
  columnCount: 2,
  columnGap: "40px",
};
const catStyle = {
  color: "#b8962e",
  marginBottom: 6,
  fontSize: 16,
  fontWeight: "bold",
  letterSpacing: 1,
};

export default App;