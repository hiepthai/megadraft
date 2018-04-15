/**
 * ExtendedRichUtils
 * @see https://gist.github.com/joshdover/7c5e61ed68cc5552dc8a25463e357960
 */

import {Modifier, EditorState, RichUtils} from "draft-js";
import {getCurrentlySelectedBlock} from "../utils";

export const ALIGNMENT_DATA_KEY = "textAlignment";

const ExtendedRichUtils = Object.assign({}, RichUtils, {

  toggleAlignment(editorState, alignment) {
    const {
      content, currentBlock, hasAtomicBlock, target,
    } = getCurrentlySelectedBlock(editorState);

    if (hasAtomicBlock) {
      return editorState;
    }

    const blockData = currentBlock.getData();
    const alignmentToSet = blockData && blockData.get(ALIGNMENT_DATA_KEY) === alignment ?
      undefined :
      alignment;

    return EditorState.push(
      editorState,
      Modifier.mergeBlockData(content, target, {
        [ALIGNMENT_DATA_KEY]: alignmentToSet,
      }),
      "change-block-data"
    );
  },

  splitBlock(editorState) {

    const contentState = Modifier.splitBlock(
      editorState.getCurrentContent(),
      editorState.getSelection()
    );
    const splitState = EditorState.push(editorState, contentState, "split-block");


    const {currentBlock} = getCurrentlySelectedBlock(editorState);
    const alignment = currentBlock.getData().get(ALIGNMENT_DATA_KEY);
    if (alignment) {
      return ExtendedRichUtils.toggleAlignment(splitState, alignment);
    }
    return splitState;

  },
});

export default ExtendedRichUtils;
