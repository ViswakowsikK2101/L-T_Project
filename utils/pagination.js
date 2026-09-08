/**
 * Reusable pagination helper.
 *
 * @param {mongoose.Model}  Model    – Mongoose model to query.
 * @param {Object}          filter   – Mongoose filter object.
 * @param {number}          [page=1] – Current page number.
 * @param {number}          [limit=10] – Items per page.
 * @param {Object|Array}    [populate] – Mongoose populate options.
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
const paginate = async (Model, filter = {}, page = 1, limit = 10, populate = null) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

  const skip = (page - 1) * limit;

  let query = Model.find(filter).skip(skip).limit(limit);

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((p) => {
        query = query.populate(p);
      });
    } else {
      query = query.populate(populate);
    }
  }

  const [total, data] = await Promise.all([
    Model.countDocuments(filter),
    query,
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
