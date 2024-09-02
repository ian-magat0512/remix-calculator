import type { MetaFunction } from "@remix-run/node";
import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { BarChart, Bar,LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useFetcher } from "@remix-run/react";
import IncomeCalculator from "./IncomeCalculator";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export default function Index() {
  return (
      <div>
        <IncomeCalculator />
      </div>
  );
}