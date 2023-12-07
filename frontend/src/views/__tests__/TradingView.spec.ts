import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TradingView from '../TradingView.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(TradingView)
    // expect(wrapper.text()).toContain('Hello Vitest')
  })
})
