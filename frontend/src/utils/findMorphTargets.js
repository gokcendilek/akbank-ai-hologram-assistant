export function findFaceBlendshapes(scene) {
  const result = {
    faceMesh: null,
    dict: null,
    idx: {
      jawOpen: -1,
      mouthOpen: -1,
      eyeBlinkLeft: -1,
      eyeBlinkRight: -1,
    },
  }

  scene.traverse((child) => {
    if (child.isSkinnedMesh || child.isMesh) {
      const dict = child.morphTargetDictionary
      const infl = child.morphTargetInfluences
      if (!dict || !infl) return

      if (!result.faceMesh) {
        result.faceMesh = child
        result.dict = dict

        const pick = (names) => {
          for (const n of names) {
            if (dict[n] !== undefined) return dict[n]
            const key = Object.keys(dict).find((k) => k.toLowerCase() === n.toLowerCase())
            if (key) return dict[key]
          }
          return -1
        }

        result.idx.jawOpen = pick(['JawOpen', 'jawOpen', 'jaw_open'])
        result.idx.mouthOpen = pick(['MouthOpen', 'mouthOpen', 'viseme_aa', 'Viseme_AA'])
        result.idx.eyeBlinkLeft = pick(['eyeBlinkLeft', 'EyeBlinkLeft'])
        result.idx.eyeBlinkRight = pick(['eyeBlinkRight', 'EyeBlinkRight'])
      }
    }
  })

  return result
}
