import * as pinning from '../../../src/modules/pinning'
import * as bzz from '../../../src/modules/bzz'
import * as bytes from '../../../src/modules/bytes'
import * as chunk from '../../../src/modules/chunk'
import {
  beeUrl,
  invalidReference,
  randomByteArray,
  testChunkData,
  testChunkHash,
  ERR_TIMEOUT,
  getPostageBatch,
  commonMatchers,
} from '../../utils'
import { Collection } from '../../../src/types'

const BEE_URL = beeUrl()
commonMatchers()

describe('modules/pin', () => {
  describe('should work with files', () => {
    const randomData = randomByteArray(5000)

    it('should pin an existing file', async () => {
      const hash = await bzz.uploadFile(BEE_URL, randomData, getPostageBatch())
      await pinning.pin(BEE_URL, hash)
    })

    it('should unpin an existing file', async () => {
      const hash = await bzz.uploadFile(BEE_URL, randomData, getPostageBatch())
      await pinning.unpin(BEE_URL, hash)
    })

    it(
      'should not pin a non-existing file',
      async () => {
        await expect(pinning.pin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
      },
      ERR_TIMEOUT,
    )

    it('should not unpin a non-existing file', async () => {
      await expect(pinning.unpin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
    })
  })

  describe('should work with collections', () => {
    const testCollection: Collection<Uint8Array> = [
      {
        path: '0',
        data: Uint8Array.from([0]),
      },
      {
        path: '1',
        data: Uint8Array.from([1]),
      },
    ]

    it('should pin an existing collection', async () => {
      const hash = await bzz.uploadCollection(BEE_URL, testCollection, getPostageBatch())
      await pinning.pin(BEE_URL, hash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })

    it('should unpin an existing collections', async () => {
      const hash = await bzz.uploadCollection(BEE_URL, testCollection, getPostageBatch())
      await pinning.unpin(BEE_URL, hash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })

    it(
      'should not pin a non-existing collections',
      async () => {
        await expect(pinning.pin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
      },
      ERR_TIMEOUT,
    )

    it('should not unpin a non-existing collections', async () => {
      await expect(pinning.unpin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
    })
  })

  describe('should work with data', () => {
    const randomData = randomByteArray(5000)

    it('should pin existing data', async () => {
      const hash = await bytes.upload(BEE_URL, randomData, getPostageBatch())
      await pinning.pin(BEE_URL, hash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })

    it('should unpin existing data', async () => {
      const hash = await bytes.upload(BEE_URL, randomData, getPostageBatch())
      await pinning.pin(BEE_URL, hash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })

    it(
      'should not pin a non-existing data',
      async () => {
        await expect(pinning.pin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
      },
      ERR_TIMEOUT,
    )

    it('should not unpin a non-existing data', async () => {
      await expect(pinning.unpin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
    })
  })

  describe('should work with chunks', () => {
    it('should pin existing chunk', async () => {
      const chunkReference = await chunk.upload(BEE_URL, testChunkData, getPostageBatch())
      expect(chunkReference).toEqual(testChunkHash)

      await pinning.pin(BEE_URL, testChunkHash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })

    it('should unpin existing chunk', async () => {
      const chunkReference = await chunk.upload(BEE_URL, testChunkData, getPostageBatch())
      expect(chunkReference).toEqual(testChunkHash)

      await pinning.unpin(BEE_URL, testChunkHash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })

    it(
      'should not pin a non-existing chunk',
      async () => {
        await expect(pinning.pin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
      },
      ERR_TIMEOUT,
    )

    it('should not unpin a non-existing chunk', async () => {
      await expect(pinning.unpin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
    })

    it('should return pinning status of existing chunk', async () => {
      const chunkReference = await chunk.upload(BEE_URL, testChunkData, getPostageBatch())
      expect(chunkReference).toEqual(testChunkHash)

      await pinning.pin(BEE_URL, testChunkHash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
      const pinningStatus = await pinning.getPin(BEE_URL, testChunkHash)
      expect(pinningStatus.reference).toEqual(testChunkHash)
    })

    it('should not return pinning status of non-existing chunk', async () => {
      await expect(pinning.getPin(BEE_URL, invalidReference)).rejects.toThrow('Not Found')
    })

    it('should return list of pinned chunks', async () => {
      const chunkReference = await chunk.upload(BEE_URL, testChunkData, getPostageBatch())
      expect(chunkReference).toEqual(testChunkHash)

      await pinning.pin(BEE_URL, testChunkHash) // Nothing is asserted as nothing is returned, will throw error if something is wrong
    })
  })
})
