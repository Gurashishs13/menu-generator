import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import categories from "./menuData";

function App() {
  const [selected, setSelected] = useState({});
  const [event, setEvent] = useState({ date: "", venue: "", gathering: "" });
  const [showBreakfast, setShowBreakfast] = useState(false);

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

  const generatePDF = () => {
    const input = document.getElementById("menu-preview");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save("GB-Caterers-Menu.pdf");
    });
  };

  return (
    <div style={{ background: "#f8f6ea", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ color: "#9d7d19", fontSize: 35, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        GB Caterers Menu Generator
      </h1>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <input placeholder="Event Date" onChange={(e) => setEvent({ ...event, date: e.target.value })} style={{ marginRight: 10, padding: 6, borderRadius: 6, border: "1.5px solid #ccb36c" }} />
        <input placeholder="Venue" onChange={(e) => setEvent({ ...event, venue: e.target.value })} style={{ marginRight: 10, padding: 6, borderRadius: 6, border: "1.5px solid #ccb36c" }} />
        <input placeholder="Gathering" onChange={(e) => setEvent({ ...event, gathering: e.target.value })} style={{ padding: 6, borderRadius: 6, border: "1.5px solid #ccb36c" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <label style={{ fontWeight: "bold", fontSize: 18, color: "#aa8f40" }}>
          <input
            type="checkbox"
            checked={showBreakfast}
            onChange={() => setShowBreakfast((b) => !b)}
            style={{ marginRight: 8 }}
          />
          Include Breakfast Section
        </label>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 25, justifyContent: "center", marginBottom: 24 }}>
        {Object.keys(categories).map(cat => {
          if (cat === "Breakfast" && !showBreakfast) return null;
          return (
            <div key={cat} style={{ backgroundColor: "#fffcf5", borderRadius: 15, boxShadow: "0 5px 30px 0 #eadfa5", border: "2.5px solid #ccb36c", padding: 20, width: 230 }}>
              <h2 style={{ color: "#b7982e", fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                {cat === "HotCold" ? "HOT & COLD" : cat.toUpperCase()}
              </h2>
              {categories[cat].map((dish) => (
                <label key={dish} style={{ display: "block", fontWeight: 400, fontSize: 16, cursor: "pointer", marginBottom: 7 }}>
                  <input
                    type="checkbox"
                    checked={selected[cat]?.includes(dish) || false}
                    onChange={() => handleCheckbox(cat, dish)}
                    style={{ marginRight: 10, transform: "scale(1.1)", verticalAlign: "middle" }}
                  />
                  {dish}
                </label>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={generatePDF}
          style={{
            backgroundColor: "#b7982e",
            color: "white",
            padding: "12px 36px",
            fontSize: 18,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(183, 146, 32, 0.7)",
            userSelect: "none",
          }}
          type="button"
        >
          Generate PDF
        </button>
      </div>
      <div
        id="menu-preview"
        style={{
          backgroundColor: "#fffcf5",
          maxWidth: 800,
          margin: "40px auto",
          padding: 32,
          borderRadius: 18,
          border: "2.5px solid #ccb36c",
          boxShadow: "0 5px 30px 0 #eadfa5",
          color: "#806600",
          fontFamily: "'Playfair Display', serif"
        }}
      >
        <div style={{ fontSize: 15, textAlign: "center", marginBottom: 5, color: "#a17B1d" }}>
          {event.date || ""} &nbsp;  &nbsp; | &nbsp; Gathering: {event.gathering || "0"} &nbsp; | &nbsp; Venue: {event.venue || ""}
        </div>
        <h1 style={{ fontWeight: "bold", fontSize: 43, color: "#b7982e", marginBottom: 20, textAlign: "center", letterSpacing: 1 }}>
          GB CATERERS
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
          <div style={{ width: "21%", textAlign: "center" }}>
            {selected.HotCold?.length > 0 && <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5 }}>HOT & COLD</h2>}
            <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
              {selected.HotCold?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
            </ul>
            {showBreakfast && selected.Breakfast?.length > 0 && (
              <>
                <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5, marginTop: 15 }}>Breakfast</h2>
                <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
                  {selected.Breakfast?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
                </ul>
              </>
            )}
          </div>
          <div style={{ width: "21%", textAlign: "center" }}>
            {selected.Stalls?.length > 0 && <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5 }}>STALLS</h2>}
            <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
              {selected.Stalls?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
            </ul>
          </div>
          <div style={{ width: "21%", textAlign: "center" }}>
            {selected.Starters?.length > 0 && <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5 }}>STARTERS</h2>}
            <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
              {selected.Starters?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
            </ul>
          </div>
          <div style={{ width: "21%", textAlign: "center" }}>
            {selected.MainCourse?.length > 0 && <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5 }}>MAIN COURSE</h2>}
            <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
              {selected.MainCourse?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
            </ul>
          </div>
          <div style={{ width: "15%", textAlign: "center" }}>
            {selected.Sweets?.length > 0 && <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5 }}>SWEETS</h2>}
            <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
              {selected.Sweets?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
            </ul>
            {selected.Breads?.length > 0 && <h2 style={{ color: "#AD8920", fontWeight: "bold", marginBottom: 5 }}>BREADS</h2>}
            <ul style={{ listStyle: "none", paddingLeft: 15, marginTop: 0 }}>
              {selected.Breads?.map((dish) => <li key={dish} style={{ marginBottom: 3 }}>{dish}</li>)}
            </ul>
          </div>
        </div>
        <hr style={{ borderTop: "1.5px solid #D2BB7A", marginTop: 25, marginBottom: 10 }} />
        <div style={{ textAlign: "center", fontSize: 16, color: "#b6a045" }}>
          Harpreet Singh 'Babloo' +9414500313 <br /> 14 mukher ji nagar, Sriganganagar
        </div>
      </div>
    </div>
  );
}

export default App;
