/**
 * Reusable pagination helper.
 *
 * @param {mongoose.Query} query   – A Mongoose query (NOT yet awaited).
 * @param {Object}         options – { page, limit } from the request query string.
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
const paginate = async (query, { page = 1, limit = 10 } = {}) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

  const skip = (page - 1) * limit;

  // Run count and data fetch in parallel for efficiency
  const [total, data] = await Promise.all([
    query.model.countDocuments(query.getFilter()),
    query.skip(skip).limit(limit),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = paginate;
