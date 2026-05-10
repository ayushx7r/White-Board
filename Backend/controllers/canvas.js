import Canvas from '../model/canvas.js'

export const getCanvases = async (req, res) => {
    const data = await Canvas.getAllCanvases(req.user.id);
    res.json(data);
}

export const createCanvas = async (req, res) => {
    const {title, isPublic} = req.body;
    try {
        const data = await Canvas.createCanvas(title, req.user.id, isPublic);
        res.json(data);
    } catch (err) {
        res.json(err);
    }
}

export const getCanvasElements = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Canvas.getCanvasElements(id);
        res.status(200).json({elements : data.elements});
    } catch(err) {
        res.status(400).json({elements : []});
    }
}

export const updateCanvasElements = async (req, res) => {
    try {
        const {id} = req.params;
        const {elements} = req.body;
        const data = await Canvas.updateCanvasElements(id, elements);
        res.status(200).json({message : "updated"});
    } catch(err) {
        res.status(400).json({message : "failed to update elements"});
    }
}

export const deleteCanvas = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await Canvas.deleteCanvas(id, req.user.id);
        return res.status(200).json({message : "canvas deleted sucessfully"});
    } catch (err) {
        res.status(500).json({message : "unable to delete. try again!"})
    }
}