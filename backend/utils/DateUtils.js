class DateUtils {
  static normalizeDate(value, fieldName = "date") {
    if (value === undefined || value === null || value === "") {
      return new Date();
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const error = new Error(`${fieldName} is invalid`);
      error.statusCode = 400;
      throw error;
    }

    return parsed;
  }

  static formatDateLabel(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  }

  static sortByDateAsc(items, accessor = (item) => item.date) {
    return [...items].sort((a, b) => new Date(accessor(a)).getTime() - new Date(accessor(b)).getTime());
  }

  static sortByDateDesc(items, accessor = (item) => item.date) {
    return [...items].sort((a, b) => new Date(accessor(b)).getTime() - new Date(accessor(a)).getTime());
  }

  static average(values) {
    const filtered = values.filter((value) => typeof value === "number" && Number.isFinite(value));
    if (filtered.length === 0) {
      return null;
    }

    const total = filtered.reduce((sum, value) => sum + value, 0);
    return total / filtered.length;
  }

  static averageByKey(items, key) {
    return this.average(items.map((item) => item?.[key]));
  }

  static splitRecentAndPrevious(items, windowSize = 3) {
    const normalizedWindow = Math.max(1, Number(windowSize) || 3);
    const sorted = this.sortByDateAsc(items);

    if (sorted.length === 0) {
      return { recent: [], previous: [] };
    }

    const recent = sorted.slice(-normalizedWindow);
    const previous = sorted.slice(-normalizedWindow * 2, -normalizedWindow);
    return { recent, previous };
  }

  static detectDirection(recentAverage, previousAverage, epsilon = 0.1) {
    if (typeof recentAverage !== "number" || typeof previousAverage !== "number") {
      return "stable";
    }

    const diff = recentAverage - previousAverage;
    if (Math.abs(diff) <= epsilon) {
      return "stable";
    }

    return diff > 0 ? "up" : "down";
  }

  static round(value, precision = 2) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return null;
    }

    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  }
}

module.exports = DateUtils;
