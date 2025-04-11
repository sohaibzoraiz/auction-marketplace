// SearchModal.js
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";

export default function SearchModal({ open, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!inputValue) return;

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/auctions/search?q=${encodeURIComponent(inputValue)}`);
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleSelect = (option) => {
    if (!option || !option.slug) return;
    router.push(`/auctions/${option.slug}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/auctions?q=${encodeURIComponent(inputValue)}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Search Cars</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Autocomplete
            freeSolo
            options={options}
            loading={loading}
            getOptionLabel={(option) => option?.title || ""}
            onChange={(e, value) => handleSelect(value)}
            inputValue={inputValue}
            onInputChange={(e, value) => setInputValue(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search cars by name, make, model..."
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
