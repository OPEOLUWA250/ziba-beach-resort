"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isBefore,
  isAfter,
  isSameDay,
} from "date-fns";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const handleDateClick = (date: Date) => {
    // Check if date is within valid range
    if (minDate && isBefore(date, minDate)) return;
    if (maxDate && isAfter(date, maxDate)) return;

    if (selectingStart) {
      onStartDateChange(date);
      setSelectingStart(false);
    } else {
      if (startDate && isBefore(date, startDate)) {
        onStartDateChange(date);
        setSelectingStart(false);
      } else {
        onEndDateChange(date);
        setSelectingStart(true);
      }
    }
  };

  const isDateInRange = (date: Date | null) => {
    if (!date || !startDate || !endDate) return false;
    return !isBefore(date, startDate) && !isAfter(date, endDate);
  };

  const isDateSelected = (date: Date | null) => {
    if (!date) return false;
    return (
      (startDate && isSameDay(date, startDate)) ||
      (endDate && isSameDay(date, endDate))
    );
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return false;
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Mode Indicator */}
      <div className="text-sm font-semibold text-blue-900">
        {selectingStart
          ? "📅 Select Check-In Date (Night)"
          : "📅 Select Check-Out Date"}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-blue-50 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-blue-900" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-blue-50 rounded-lg transition"
        >
          <ChevronRight className="w-5 h-5 text-blue-900" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const isDisabled = date && isDateDisabled(date);
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isStart = startDate && date && isSameDay(date, startDate);
          const isEnd = endDate && date && isSameDay(date, endDate);

          return (
            <button
              key={idx}
              onClick={() => date && !isDisabled && handleDateClick(date)}
              disabled={!date || isDisabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition
                ${!date ? "invisible" : ""}
                ${isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50" : ""}
                ${isSelected && (isStart || isEnd) ? "bg-blue-900 text-white shadow-md" : ""}
                ${isInRange && !isSelected ? "bg-blue-100 text-blue-900" : ""}
                ${!isSelected && !isInRange && date && !isDisabled ? "text-gray-900 hover:bg-blue-50 cursor-pointer" : ""}
              `}
              title={date ? format(date, "MMM d, yyyy") : ""}
            >
              {date ? format(date, "d") : ""}
            </button>
          );
        })}
      </div>

      {/* Selected Dates Display */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Check-In:</span>
          <span className="text-sm font-bold text-blue-900">
            {startDate ? format(startDate, "MMM d, yyyy") : "Not selected"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            Check-Out:
          </span>
          <span className="text-sm font-bold text-blue-900">
            {endDate ? format(endDate, "MMM d, yyyy") : "Not selected"}
          </span>
        </div>
      </div>
    </div>
  );
}
