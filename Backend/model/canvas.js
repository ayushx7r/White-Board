import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    x: Number,
    y: Number,
  },
  { _id: false }
);

const elementSchema = new mongoose.Schema(
  {
    id: String,

    type: {
      type: String,
      required: true,
    },

    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,

    points: [pointSchema],

    text: String,

    options: {
      stroke: String,
      fill: String,
      strokeWidth: Number,
      roughness: Number,
      opacity: Number,
    },
  },
  { _id: false }
);

const canvasSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Canvas",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    thumbnail: {
      type: String,
      default: "",
    },

    elements: {
      type: [elementSchema],
      default: [],
    },

    background: {
      type: String,
      default: "#121212",
    },

    viewport: {
      offsetX: {
        type: Number,
        default: 0,
      },

      offsetY: {
        type: Number,
        default: 0,
      },

      scale: {
        type: Number,
        default: 1,
      },
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

canvasSchema.statics.createCanvas = async function (
  title,
  owner,
  isPublic
) {
  const canvas = await this.create({
    title,
    owner,
    isPublic
  });

  return canvas;
};

canvasSchema.statics.deleteCanvas = async function (
  canvasId,
  userId
) {
  const canvas = await this.findOneAndDelete({
    _id: canvasId,
    owner: userId,
  });

  if (!canvas) {
    throw new Error("Canvas not found");
  }

  return canvas;
};

canvasSchema.statics.getCanvasById = async function (
  canvasId
) {
  const canvas = await this.findById(canvasId);

  if (!canvas) {
    throw new Error("Canvas not found");
  }

  return canvas;
};

canvasSchema.statics.getAllCanvases = async function (
  userId
) {
  return await this.find({
    owner: userId,
  })
    .sort({ updatedAt: -1 })
    .select(
      "_id title thumbnail updatedAt createdAt isPublic"
    );
};

canvasSchema.statics.updateCanvasElements =
  async function (canvasId, elements) {
    const canvas = await this.findByIdAndUpdate(
      canvasId,
      {
        elements,
      },
      {
        returnDocument: "after"
      }
    );
    return canvas;
  };

canvasSchema.statics.getCanvasElements = async function(canvasId) {
    const canvas = await this.findOne({_id : canvasId});
    return await canvas.populate({
      path: 'elements',
      populate: {
        path: 'points', 
      }
    });
}

canvasSchema.statics.updateThumbnail =
  async function (canvasId, thumbnail) {
    return await this.findByIdAndUpdate(
      canvasId,
      {
        thumbnail,
      },
      {
        new: true,
      }
    );
  };

canvasSchema.statics.renameCanvas =
  async function (canvasId, title) {
    return await this.findByIdAndUpdate(
      canvasId,
      {
        title,
      },
      {
        new: true,
      }
    );
  };

canvasSchema.statics.toggleCanvasVisibility =
  async function (canvasId) {
    const canvas = await this.findById(canvasId);

    if (!canvas) {
      throw new Error("Canvas not found");
    }

    canvas.isPublic = !canvas.isPublic;

    await canvas.save();

    return canvas;
  };

const Canvas = mongoose.model(
  "Canvas",
  canvasSchema
);

export default Canvas;