export const asyncHandler = (API) => {
    return (req, res, next) => {
        try {
            API(req, res, next)
        } catch (error) {
            res.status(500).json({
                message: "faild",
                error
            })
        }
    }
}

export const globalResponse = (error, req, res, next) => {
    if (error) {
      if (req.validationErrorArr) {
        return res
          .status(error['cause']|| 400)
          .json({ message: req.validationErrorArr })
      }
      return res.status(error['cause'] || 500).json({ message: error.message })
    }
  }