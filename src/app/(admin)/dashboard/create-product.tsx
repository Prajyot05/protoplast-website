"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/actions/products";
import BaseModal from "@/components/base-modal";

export default function CreateProduct() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createProduct({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      images: [form.image],
    });

    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="explore"
        className="mb-4 text-white"
      >
        + Create Product
      </Button>

      <BaseModal
        open={open}
        onClose={() => setOpen(false)}
        title="Create New Product"
      >
        <div className="space-y-4">
          <Input name="title" placeholder="Title" onChange={handleChange} />
          <Textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="price"
              placeholder="Price (₹)"
              type="number"
              onChange={handleChange}
            />
            <Input
              name="stock"
              placeholder="Stock"
              type="number"
              onChange={handleChange}
            />
          </div>
          <Input
            name="category"
            placeholder="Category ID"
            onChange={handleChange}
          />
          <Input
            name="image"
            placeholder="Main Image URL"
            onChange={handleChange}
          />
        </div>

        <Button
          onClick={handleSubmit}
          variant="explore"
          className="mt-6 w-full font-semibold text-white"
        >
          Submit
        </Button>
      </BaseModal>
    </>
  );
}
