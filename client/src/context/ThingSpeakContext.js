"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const ThingSpeakContext = createContext()

export const useThingSpeak = () => useContext(ThingSpeakContext)

export const ThingSpeakProvider = ({ children }) => {
  const [channelData, setChannelData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ThingSpeak configuration
  const CHANNEL_ID = "2293900"
  const API_KEY = "SMXU76RXPC1UV049"

  // Fetch latest data from ThingSpeak
  const fetchLatestData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`,
      )
      setChannelData(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching ThingSpeak data:", err)
      setError("Failed to fetch ThingSpeak data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch historical data from ThingSpeak
  const fetchHistoricalData = async (days = 1) => {
    try {
      setLoading(true)
      // Calculate start date (days ago from now)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Format dates for ThingSpeak API
      const startDateStr = startDate.toISOString()
      const endDateStr = endDate.toISOString()

      const response = await axios.get(
        `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&start=${startDateStr}&end=${endDateStr}`,
      )

      // Process and format the data for charts
      const formattedData = response.data.feeds.map((feed) => ({
        timestamp: new Date(feed.created_at).getTime(),
        motorTemp: Number.parseFloat(feed.field1) || 0,
        ambientTemp: Number.parseFloat(feed.field2) || 0,
        linearX: Number.parseFloat(feed.field3) || 0,
        linearY: Number.parseFloat(feed.field4) || 0,
        linearZ: Number.parseFloat(feed.field5) || 0,
        motorCurrent: Number.parseFloat(feed.field6) || 0,
      }))

      setHistoricalData(formattedData)
      setError(null)
    } catch (err) {
      console.error("Error fetching historical data:", err)
      setError("Failed to fetch historical data")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchLatestData()
    // Fetch data every 15 seconds
    const interval = setInterval(fetchLatestData, 15000)
    return () => clearInterval(interval)
  }, [])

  // Map ThingSpeak fields to our application fields
  const getNodeDataFromThingSpeak = (nodeId) => {
    if (!channelData) return null

    return {
      motorTemperature: Number.parseFloat(channelData.field1) || 0,
      ambientTemperature: Number.parseFloat(channelData.field2) || 0,
      linearX: Number.parseFloat(channelData.field3) || 0,
      linearY: Number.parseFloat(channelData.field4) || 0,
      linearZ: Number.parseFloat(channelData.field5) || 0,
      motorCurrent: Number.parseFloat(channelData.field6) || 0,
      lastUpdated: channelData.created_at,
    }
  }

  const value = {
    channelData,
    historicalData,
    loading,
    error,
    fetchLatestData,
    fetchHistoricalData,
    getNodeDataFromThingSpeak,
    CHANNEL_ID,
    API_KEY,
  }

  return <ThingSpeakContext.Provider value={value}>{children}</ThingSpeakContext.Provider>
}
