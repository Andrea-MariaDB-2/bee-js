import { createFeedManifest, fetchFeedUpdate } from '../../../src/modules/feed'
import { HexString, hexToBytes, makeHexString } from '../../../src/utils/hex'
import {
  beeUrl,
  commonMatchers,
  ERR_TIMEOUT,
  getPostageBatch,
  testIdentity,
  tryDeleteChunkFromLocalStorage,
} from '../../utils'
import { upload as uploadSOC } from '../../../src/modules/soc'
import type { Topic } from '../../../src/types'

commonMatchers()

describe('modules/feed', () => {
  const url = beeUrl()
  const owner = makeHexString(testIdentity.address, 40)
  const topic = '0000000000000000000000000000000000000000000000000000000000000000' as Topic

  test('feed manifest creation', async () => {
    const reference = '92442c3e08a308aeba8e2d231733ec57011a203354cad24129e7e0c37bac0cbe'
    const response = await createFeedManifest(url, owner, topic, getPostageBatch())

    expect(response).toEqual(reference)
  })

  test(
    'empty feed update',
    async () => {
      const emptyTopic = '1000000000000000000000000000000000000000000000000000000000000000' as Topic
      const feedUpdate = fetchFeedUpdate(url, owner, emptyTopic)

      await expect(feedUpdate).rejects.toThrow('Not Found')
    },
    ERR_TIMEOUT,
  )

  test('one feed update', async () => {
    const oneUpdateTopic = '2000000000000000000000000000000000000000000000000000000000000000' as Topic
    const identifier = '7c5c4c857ed4cae434c2c737bad58a93719f9b678647310ffd03a20862246a3b'
    const signature =
      'bba40ea2c87b7801f54f5cca70e06deaed5c366b588e38ce0c42f7f8f16562c3243b43101faa6dbaeaab3244b1a0ceaec92dd117995e19116a372eadbec945b01b'
    const socData = hexToBytes(
      '280000000000000000000000602a57df0000000000000000000000000000000000000000000000000000000000000000' as HexString,
    )

    // delete the chunk from local storage if already exists
    // this makes the test repeatable
    const cacAddress = '03e8eef6d72dbca9dfb7d2e15a5a305a152a3807ac7fd5ea52721a16972f3813'
    await tryDeleteChunkFromLocalStorage(cacAddress)

    const socResponse = await uploadSOC(url, owner, identifier, signature, socData, getPostageBatch())
    expect(socResponse).toBeType('string')

    const feedUpdate = await fetchFeedUpdate(url, owner, oneUpdateTopic)
    expect(feedUpdate.reference).toBeType('string')
    expect(feedUpdate.feedIndex).toEqual('0000000000000000')
    expect(feedUpdate.feedIndexNext).toEqual('0000000000000001')
  }, 21000)
})
